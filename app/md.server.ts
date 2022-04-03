import parseFrontMatter from "front-matter";
import LRUCache from "lru-cache";
import rangeParser from "parse-numeric-range";
import path from "path";
import { getHighlighter, loadTheme } from "shiki";
import invariant from "tiny-invariant";
import { dataPath } from "~/data.server";
import { isString } from "~/lib/utils";

import type * as Unist from "unist";
import type * as Hast from "hast";
import type * as Shiki from "shiki";

interface AsyncMdModules {
	unified: typeof import("unified")["unified"];
	remarkSlug: typeof import("remark-slug")["default"];
	remarkGfm: typeof import("remark-gfm")["default"];
	remarkParse: typeof import("remark-parse")["default"];
	remarkRehype: typeof import("remark-rehype")["default"];
	rehypeStringify: typeof import("rehype-stringify")["default"];
	escapeGoat: typeof import("escape-goat");
	unistUtilVisit: typeof import("unist-util-visit");
}

const markdownCache = new LRUCache<string, MarkdownParsed<any>>({
	max: Math.round((1024 * 1024 * 12) / 10),
	maxSize: 1024 * 1024 * 12, // 12mb
	sizeCalculation(value, key) {
		return JSON.stringify(value).length + (key ? key.length : 0);
	},
});

let _highlighter: Shiki.Highlighter | null = null;
let _base16Theme: Shiki.IShikiTheme | null = null;
let _asyncMdModules: AsyncMdModules | null = null;

async function loadAsyncModules(): Promise<AsyncMdModules> {
	if (_asyncMdModules) {
		return _asyncMdModules;
	}
	let [
		{ unified },
		{ default: remarkSlug },
		{ default: remarkGfm },
		{ default: remarkParse },
		{ default: remarkRehype },
		{ default: rehypeStringify },
		unistUtilVisit,
		escapeGoat,
	] = await Promise.all([
		import("unified"),
		import("remark-slug"),
		import("remark-gfm"),
		import("remark-parse"),
		import("remark-rehype"),
		import("rehype-stringify"),
		import("unist-util-visit"),
		import("escape-goat"),
	]);
	return (_asyncMdModules = {
		unified,
		remarkSlug,
		remarkGfm,
		remarkParse,
		remarkRehype,
		rehypeStringify,
		unistUtilVisit,
		escapeGoat,
	});
}

async function loadShikiHighlighter(
	themes: Shiki.IThemeRegistration[],
	langs: (Shiki.Lang | Shiki.ILanguageRegistration)[]
): Promise<Shiki.Highlighter> {
	if (_highlighter) {
		return _highlighter;
	}
	return (_highlighter = await getHighlighter({ themes, langs }));
}

async function loadBase16Theme(): Promise<Shiki.IShikiTheme> {
	if (_base16Theme) {
		return _base16Theme;
	}
	return (_base16Theme = await loadTheme(
		path.resolve(dataPath, "shiki-base16.json")
	));
}

interface MarkdownParsed<Frontmatter> {
	markdown: string;
	html: string;
	frontmatter: Frontmatter;
}

export async function parseMarkdown<Frontmatter extends {}>(
	key: string,
	contents: string,
	isValidFrontMatter: (frontmatter: any) => frontmatter is Frontmatter,
	debugKey?: string
): Promise<MarkdownParsed<Frontmatter> | null> {
	let cached = markdownCache.get(key);
	if (cached) {
		return cached;
	}

	let processor = await getProcessor();
	let { attributes: frontmatter, body: markdown } = parseFrontMatter(contents);
	let html = String(await processor.process(markdown));

	invariant(
		isValidFrontMatter(frontmatter),
		`${
			debugKey ? `Invalid frontmatter in ${debugKey}` : "Invalid frontmatter"
		}. Received: ${JSON.stringify(frontmatter)}`
	);

	let parsed = {
		markdown,
		frontmatter,
		html,
	};
	markdownCache.set(key, parsed);
	return parsed;
}

export interface ProcessorOptions {
	resolveHref?(href: string): string;
}

async function getProcessor(options: ProcessorOptions = {}) {
	let { unified, remarkParse, remarkGfm, remarkRehype, rehypeStringify } =
		await loadAsyncModules();

	return unified()
		.use(remarkParse)
		.use(stripLinkExtPlugin, options)
		.use(remarkCodeBlocksPlugin)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify);
}

function stripLinkExtPlugin(options: ProcessorOptions) {
	return async function transformer(tree: UnistNode.Root): Promise<void> {
		let {
			unistUtilVisit: { visit, SKIP },
		} = await loadAsyncModules();
		visit(tree, "link", (node, index, parent) => {
			if (
				options.resolveHref &&
				isString(node.url) &&
				isRelativeUrl(node.url)
			) {
				if (parent && index != null) {
					parent.children[index] = {
						...node,
						url: options.resolveHref(node.url),
					};
					return SKIP;
				}
			}
		});
	};
}

function remarkCodeBlocksPlugin() {
	return async function transformer(tree: UnistNode.Root): Promise<void> {
		let {
			escapeGoat: { htmlEscape },
			unistUtilVisit: { visit, SKIP },
		} = await loadAsyncModules();
		let theme = await loadBase16Theme();
		let langs: Shiki.Lang[] = [
			"css",
			"diff",
			"html",
			// Not supported, sadness
			// @ts-ignore
			// "http",
			"js",
			"javascript",
			"json",
			"jsx",
			"markdown",
			"md",
			"mdx",
			"prisma",
			"scss",
			"shellscript",
			"ts",
			"typescript",
			"tsx",
		];
		let langSet = new Set(langs);
		let highlighter = await loadShikiHighlighter([theme], langs);
		let themeName = "base16";

		visit(tree, "code", (node) => {
			if (!node.lang || !node.value || !langSet.has(node.lang)) {
				return;
			}

			switch (node.lang) {
				case "js":
					node.lang = "javascript";
					break;
				case "ts":
					node.lang = "typescript";
					break;
			}

			// TODO: figure out how this is ever an array?
			let meta = Array.isArray(node.meta) ? node.meta[0] : node.meta;

			let metaParams = new URLSearchParams();
			if (meta) {
				let linesHighlightsMetaShorthand = meta.match(/^\[(.+)\]$/);
				if (linesHighlightsMetaShorthand) {
					metaParams.set("lines", linesHighlightsMetaShorthand[0]);
				} else {
					metaParams = new URLSearchParams(meta.split(/\s+/).join("&"));
				}
			}

			let highlightLines = parseLineHighlights(metaParams.get("lines"));
			let numbers = !metaParams.has("nonumber");

			let fgColor = convertFakeHexToCustomProp(
				highlighter.getForegroundColor(themeName) || ""
			);
			// let bgColor = convertFakeHexToCustomProp(
			// 	highlighter.getBackgroundColor(themeName) || ""
			// );
			let tokens = highlighter.codeToThemedTokens(
				node.value as string,
				node.lang,
				themeName
			);
			let children = tokens.map(
				(lineTokens, zeroBasedLineNumber): Hast.Element => {
					let children = lineTokens.map((token): Hast.Text | Hast.Element => {
						let color = convertFakeHexToCustomProp(token.color || "");
						let content: Hast.Text = {
							type: "text",
							// Do not escape the _actual_ content
							value: token.content,
						};

						return color && color !== fgColor
							? {
									type: "element",
									tagName: "span",
									properties: {
										style: `color: ${htmlEscape(color)}`,
									},
									children: [content],
							  }
							: content;
					});

					children.push({
						type: "text",
						value: "\n",
					});

					return {
						type: "element",
						tagName: "span",
						properties: {
							className: "codeblock-line",
							dataHighlight: highlightLines?.includes(zeroBasedLineNumber + 1)
								? "true"
								: undefined,
							dataLineNumber: zeroBasedLineNumber + 1,
						},
						children,
					};
				}
			);

			let metaProps: { [key: string]: string } = {};
			metaParams.forEach((val, key) => {
				if (key === "lines") return;
				metaProps[`data-${key}`] = val;
			});

			let nodeValue = {
				type: "element",
				tagName: "pre",
				properties: {
					...metaProps,
					dataLineNumbers: numbers ? "true" : "false",
					dataLang: htmlEscape(node.lang),
					style: `color: ${htmlEscape(fgColor)};`,
				},
				children: [
					{
						type: "element",
						tagName: "code",
						children,
					},
				],
			};

			let data = node.data ?? (node.data = {});

			(node as any).type = "element";
			data.hProperties ??= {};
			data.hChildren = [nodeValue];

			return SKIP;
		});
	};
}

function parseLineHighlights(param: string | null) {
	let range = param?.match(/^\[(.+)\]$/);
	if (!range) {
		return [];
	}
	return rangeParser(range[1]);
}

// The theme actually stores #FFFF${base-16-color-id} because vscode-textmate
// requires colors to be valid hex codes, if they aren't, it changes them to a
// default, so this is a mega hack to trick it.
function convertFakeHexToCustomProp(color: string) {
	return color.replace(/^#FFFF(.+)/, "var(--base$1)");
}

function isRelativeUrl(test: string) {
	// Probably fragile but should work well enough. It would be nice if the
	// consumer could provide a baseURI we could do something like:
	//   - new URL(baseURI).origin === new URL(test, baseURI).origin
	return !/^(?:[a-z]+:)?\/\//i.test(test);
}

namespace UnistNode {
	export type Content = Flow | Phrasing;
	export interface Root extends Unist.Parent {
		type: "root";
		children: Flow[];
	}

	export type Flow = Blockquote | Heading | ParagraphNode | Link | Pre | Code;

	export interface Blockquote extends Unist.Parent {
		type: "blockquote";
		children: Flow[];
	}

	export interface Heading extends Unist.Parent {
		type: "heading";
		depth: number;
		children: UnistNode.Phrasing[];
	}

	interface ParagraphNode extends Unist.Parent {
		type: "paragraph";
		children: Phrasing[];
	}

	export interface Pre extends Unist.Parent {
		type: "pre";
		children: Phrasing[];
	}

	export interface Code extends Unist.Parent {
		type: "code";
		children: Phrasing[];
		value?: string;
		lang?: Shiki.Lang;
		meta?: string | string[];
	}

	export type Phrasing = Text | Emphasis;

	export interface Emphasis extends Unist.Parent {
		type: "emphasis";
		children: Phrasing[];
	}

	export interface Link extends Unist.Parent {
		type: "link";
		children: Flow[];
		url?: string;
	}

	export interface Text extends Unist.Literal {
		type: "text";
		value: string;
	}
}
