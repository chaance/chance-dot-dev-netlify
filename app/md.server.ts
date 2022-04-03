import path from "path";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { getHighlighter, loadTheme } from "shiki";
import rangeParser from "parse-numeric-range";
import { dataPath } from "~/data.server";

import type { Parent, Literal } from "unist";
import type { Highlighter, Lang, IShikiTheme } from "shiki";
import type { Element, Text } from "hast";

let _highlighter: Highlighter | null = null;
let _base16Theme: IShikiTheme | null = null;
let _asyncMdModules: AsyncMdModules | null = null;

type HastText = Text;
type HastElement = Element;

type RemarkSlug = typeof import("remark-slug")["default"];
type RemarkGfm = typeof import("remark-gfm")["default"];
type UnistUtilVisit = typeof import("unist-util-visit");
type EscapeGoat = typeof import("escape-goat");
type Unified = typeof import("unified")["unified"];
type RemarkParse = typeof import("remark-parse")["default"];
type RemarkRehype = typeof import("remark-rehype")["default"];
type RehypeStringify = typeof import("rehype-stringify")["default"];

interface AsyncMdModules {
	unified: Unified;
	remarkSlug: RemarkSlug;
	remarkGfm: RemarkGfm;
	remarkParse: RemarkParse;
	remarkRehype: RemarkRehype;
	rehypeStringify: RehypeStringify;
	escapeGoat: EscapeGoat;
	unistUtilVisit: UnistUtilVisit;
}

async function getAsyncMdModules(): Promise<AsyncMdModules> {
	if (_asyncMdModules) {
		return _asyncMdModules;
	}
	let [
		{ unified },
		remarkSlug,
		remarkGfm,
		remarkParse,
		remarkRehype,
		rehypeStringify,
		unistUtilVisit,
		escapeGoat,
	] = await Promise.all([
		import("unified"),
		import("remark-slug").then((mod) => mod.default),
		import("remark-gfm").then((mod) => mod.default),
		import("remark-parse").then((mod) => mod.default),
		import("remark-rehype").then((mod) => mod.default),
		import("rehype-stringify").then((mod) => mod.default),
		import("unist-util-visit"),
		import("escape-goat"),
	]);
	return {
		unified,
		remarkSlug,
		remarkGfm,
		remarkParse,
		remarkRehype,
		rehypeStringify,
		unistUtilVisit,
		escapeGoat,
	};
}

export async function parseMarkdown(
	contents: string,
	slug: string
): Promise<MarkdownParsed | null> {
	let processor = await getProcessor();
	let { attributes: frontmatter, body } = parseFrontMatter(contents);
	let html = String(await processor.process(body));

	invariant(
		isMarkdownPostFrontmatter(frontmatter),
		`Invalid post frontmatter in ${slug}. Received: ${JSON.stringify(
			frontmatter
		)}`
	);

	return {
		markdown: body,
		frontmatter,
		html,
	};
}

export interface ProcessorOptions {
	resolveHref?(href: string): string;
}

async function getProcessor(options: ProcessorOptions = {}) {
	let { unified, remarkParse, remarkGfm, remarkRehype, rehypeStringify } =
		await getAsyncMdModules();

	return unified()
		.use(remarkParse)
		.use(stripLinkExtPlugin, options)
		.use(remarkCodeBlocksShiki)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify);
}

export function getSlugFromPath(filePath: string) {
	return new RegExp(`${path.sep}index.md$`).test(filePath)
		? path.basename(path.dirname(filePath))
		: path.basename(filePath, ".md");
}

/**
 * Markdown frontmatter data describing a post
 */
export interface MarkdownPost extends Frontmatter {
	markdown: string;
	html: string;
	slug: string;
}

/**
 * Markdown frontmatter author
 */
export interface Author {
	name: string;
	title: string;
	avatar: string;
}

/**
 * Seems pretty easy to type up a markdown frontmatter wrong, so we've got this runtime check that also gives us some type safety
 */
export function isMarkdownPostFrontmatter(obj: any): obj is Frontmatter {
	return (
		typeof obj === "object" &&
		typeof obj.title === "string" &&
		typeof obj.createdAt === "string" &&
		(typeof obj.updatedAt === "string" ||
			typeof obj.updatedAt === "undefined") &&
		(typeof obj.draft === "boolean" || typeof obj.draft === "undefined")
	);
}

function stripLinkExtPlugin(options: ProcessorOptions) {
	return async function transformer(tree: RootNode): Promise<void> {
		let {
			unistUtilVisit: { visit, SKIP },
		} = await getAsyncMdModules();
		visit(tree, "link", (node, index, parent) => {
			if (
				options.resolveHref &&
				typeof node.url === "string" &&
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

function isRelativeUrl(test: string) {
	// Probably fragile but should work well enough.
	// It would be nice if the consumer could provide a baseURI we could do
	// something like:
	// new URL(baseURI).origin === new URL(test, baseURI).origin
	let regexp = new RegExp("^(?:[a-z]+:)?//", "i");
	return !regexp.test(test);
}

async function loadBase16() {
	if (_base16Theme) {
		return _base16Theme;
	}
	return (_base16Theme = await loadTheme(
		path.resolve(dataPath, "shiki-base16.json")
	));
}

function remarkCodeBlocksShiki() {
	return async function transformer(tree: RootNode): Promise<void> {
		let {
			escapeGoat: { htmlEscape },
			unistUtilVisit: { visit, SKIP },
		} = await getAsyncMdModules();
		let theme = await loadBase16();
		let langs: Lang[] = [
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

		let highlighter =
			_highlighter ||
			(_highlighter = await getHighlighter({ themes: [theme], langs }));

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
			let children = tokens.map((lineTokens, zeroBasedLineNumber): Element => {
				let children = lineTokens.map((token): HastText | HastElement => {
					let color = convertFakeHexToCustomProp(token.color || "");
					let content: HastText = {
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
			});

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
	if (!param) return [];
	let range = param.match(/^\[(.+)\]$/);
	if (!range) return [];
	return rangeParser(range[1]);
}

// The theme actually stores #FFFF${base-16-color-id} because vscode-textmate
// requires colors to be valid hex codes, if they aren't, it changes them to a
// default, so this is a mega hack to trick it.
function convertFakeHexToCustomProp(color: string) {
	return color.replace(/^#FFFF(.+)/, "var(--base$1)");
}

////

// type ContentNode = FlowNode | PhrasingNode;

interface RootNode extends Parent {
	type: "root";
	children: FlowNode[];
}

type FlowNode =
	| BlockquoteNode
	| HeadingNode
	| ParagraphNode
	| LinkNode
	| PreNode
	| CodeNode;

interface BlockquoteNode extends Parent {
	type: "blockquote";
	children: FlowNode[];
}

interface HeadingNode extends Parent {
	type: "heading";
	depth: number;
	children: PhrasingNode[];
}

interface ParagraphNode extends Parent {
	type: "paragraph";
	children: PhrasingNode[];
}

interface PreNode extends Parent {
	type: "pre";
	children: PhrasingNode[];
}

interface CodeNode extends Parent {
	type: "code";
	children: PhrasingNode[];
	value?: string;
	lang?: Lang;
	meta?: string | string[];
}

type PhrasingNode = TextNode | EmphasisNode;

interface EmphasisNode extends Parent {
	type: "emphasis";
	children: PhrasingNode[];
}

interface LinkNode extends Parent {
	type: "link";
	children: FlowNode[];
	url?: string;
}

interface TextNode extends Literal {
	type: "text";
	value: string;
}

interface MarkdownParsed {
	markdown: string;
	html: string;
	frontmatter: Frontmatter;
}

interface Frontmatter {
	title: string;
	createdAt: string;
	description?: string;
	draft?: boolean;
	excerpt?: string;
	updatedAt?: string;
}

export interface MarkdownPost extends Frontmatter {
	markdown: string;
	html: string;
	slug: string;
}
