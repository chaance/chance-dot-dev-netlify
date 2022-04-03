import type * as Unified from "unified";
import type * as Hast from "hast";
import path from "path";
import fs from "fs/promises";
import { loadTheme, getHighlighter } from "shiki";
import { bundleMDX } from "mdx-bundler";
import calculateReadingTime from "reading-time";
import remarkEmbedder from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import rangeParser from "parse-numeric-range";
import type { TransformerInfo } from "@remark-embedder/core";

import type { Highlighter, Lang, IShikiTheme } from "shiki";
import type TPQueue from "p-queue";
import type { Parent, Literal } from "unist";
import { dataPath } from "~/data.server";

const rehypePlugins: Unified.PluggableList = [removePreContainerDivs];
const remarkPlugins: Unified.PluggableList = [
	remarkCodeBlocksShiki,
	// optimizeCloudinaryImages,
	[
		remarkEmbedder as any, // 🤷‍♂️
		{
			handleError: handleEmbedderError,
			handleHTML: handleEmbedderHtml,
			transformers: [
				/* twitterTransformer, eggheadTransformer, */ oembedTransformer,
			],
		},
	],
	autoAffiliates,
];

let _highlighter: Highlighter | null = null;
let _base16Theme: IShikiTheme | null = null;
let _queue: TPQueue | null = null;
let _asyncMdxModules: AsyncMdxModules | null = null;

async function getMdxFiles(directoryName: string) {
	let allFiles = await fs.readdir(directoryName);
	let filesToMdx = await Promise.all(
		allFiles.map(async (pathName) => {
			return /\.mdx?$/.test(path.basename(pathName));
		})
	);
	return allFiles.filter((_, i) => filesToMdx[i]);
}

async function compileMdx<FrontmatterType extends Record<string, unknown>>({
	filePath,
	slug,
	cwd,
}: {
	filePath: string;
	slug: string;
	cwd?: string;
}) {
	// const { default: remarkAutolinkHeadings } = await import(
	// 	"remark-autolink-headings"
	// );
	let { remarkSlug, remarkGfm } = await getAsyncMdxModules();
	let fileContent = await fs.readFile(filePath, { encoding: "utf-8" });

	try {
		let { frontmatter, code } = await bundleMDX({
			source: fileContent,
			cwd,
			mdxOptions(options) {
				options.remarkPlugins = [
					...(options.remarkPlugins ?? []),
					remarkSlug,
					remarkGfm,
					...remarkPlugins,
				];
				options.rehypePlugins = [
					...(options.rehypePlugins ?? []),
					...rehypePlugins,
				];
				return options;
			},
		});
		let readTime = calculateReadingTime(fileContent);

		return {
			code,
			readTime,
			frontmatter: frontmatter as FrontmatterType,
		};
	} catch (error: unknown) {
		console.error(`Compilation error for slug: `, slug);
		throw error;
	}
}

// We have to use a queue because we can't run more than one of these at a time
// or we'll hit an out of memory error because esbuild uses a lot of memory...
async function queuedCompileMdx<
	FrontmatterType extends Record<string, unknown>
>(...args: Parameters<typeof compileMdx>) {
	const queue = await getQueue();
	const result = await queue.add(() => compileMdx<FrontmatterType>(...args));
	return result;
}

export { queuedCompileMdx as compileMdx, getMdxFiles };

function removePreContainerDivs() {
	return async function preContainerDivsTransformer(tree: Hast.Root) {
		let {
			unistUtilVisit: { visit },
		} = await getAsyncMdxModules();
		visit(
			tree,
			{ type: "element", tagName: "pre" },
			function visitor(node, index, parent) {
				if (parent?.type !== "element") return;
				if (parent.tagName !== "div") return;
				if (parent.children.length !== 1 && index === 0) return;
				Object.assign(parent, node);
			}
		);
	};
}

async function getQueue() {
	let { default: PQueue } = await import("p-queue");
	if (_queue) {
		return _queue;
	}
	_queue = new PQueue({ concurrency: 1 });
	return _queue;
}

async function loadBase16() {
	if (_base16Theme) {
		return _base16Theme;
	}
	return (_base16Theme = await loadTheme(
		path.resolve(dataPath, "shiki-base16.json")
	));
}

type RemarkSlug = typeof import("remark-slug")["default"];
type RemarkGfm = typeof import("remark-gfm")["default"];
type UnistUtilVisit = typeof import("unist-util-visit");
type EscapeGoat = typeof import("escape-goat");
interface AsyncMdxModules {
	escapeGoat: EscapeGoat;
	remarkSlug: RemarkSlug;
	remarkGfm: RemarkGfm;
	unistUtilVisit: UnistUtilVisit;
}

async function getAsyncMdxModules(): Promise<AsyncMdxModules> {
	if (_asyncMdxModules) {
		return _asyncMdxModules;
	}
	let [remarkSlug, remarkGfm, unistUtilVisit, escapeGoat] = await Promise.all([
		import("remark-slug").then((mod) => mod.default),
		import("remark-gfm").then((mod) => mod.default),
		import("unist-util-visit"),
		import("escape-goat"),
	]);
	return {
		remarkSlug,
		remarkGfm,
		unistUtilVisit,
		escapeGoat,
	};
}

function handleEmbedderError({ url }: { url: string }) {
	return `<p>Error embedding <a href="${url}">${url}</a>.`;
}

type GottenHTML = string | null;
function handleEmbedderHtml(html: GottenHTML, info: TransformerInfo) {
	if (!html) {
		return null;
	}

	let url = new URL(info.url);
	// matches youtu.be and youtube.com
	if (/youtu\.?be/.test(url.hostname)) {
		// this allows us to set youtube embeds to 100% width and the height will be
		// relative to that width with a good aspect ratio
		return makeEmbed(html, "youtube");
	}
	if (url.hostname.includes("codesandbox.io")) {
		return makeEmbed(html, "codesandbox", 4 / 5);
	}
	return html;
}

function makeEmbed(html: string, type: string, heightRatio = 56.25 / 100) {
	return `
  <div class="embed" data-embed-type="${type}">
    <div style="padding-bottom: ${heightRatio * 100}%">
      ${html}
    </div>
  </div>
`;
}

function autoAffiliates() {
	return async function affiliateTransformer(tree: RootNode): Promise<void> {
		let {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			unistUtilVisit: { visit },
		} = await getAsyncMdxModules();
		// visit(tree, "link", (linkNode) => {
		// 	if (linkNode.url?.includes("amazon.com")) {
		// 		let amazonUrl = new URL(linkNode.url);
		// 		if (!amazonUrl.searchParams.has("tag")) {
		// 			// TODO: Change this
		// 			amazonUrl.searchParams.set("tag", "kentcdodds-20");
		// 			linkNode.url = amazonUrl.toString();
		// 		}
		// 	}
		// 	if (linkNode.url?.includes("egghead.io")) {
		// 		const eggheadUrl = new URL(linkNode.url);
		// 		if (!eggheadUrl.searchParams.has("af")) {
		// 			// TODO: Change this
		// 			eggheadUrl.searchParams.set("af", "5236ad");
		// 			linkNode.url = eggheadUrl.toString();
		// 		}
		// 	}
		// });
	};
}

function remarkCodeBlocksShiki() {
	return async function transformer(tree: RootNode): Promise<void> {
		let {
			escapeGoat: { htmlEscape },
			unistUtilVisit: { visit, SKIP },
		} = await getAsyncMdxModules();
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
			let children = tokens.map(
				(lineTokens, zeroBasedLineNumber): Hast.Element => {
					let children = lineTokens.map((token): Hast.Text | Hast.Element => {
						let color = convertFakeHexToCustomProp(token.color || "");
						let content: TextNode = {
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

function parseLineHighlights(param: string | null): number[] {
	if (!param) {
		return [];
	}
	let range = param.match(/^\[(.+)\]$/);
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

// interface MarkdownParsed {
// 	markdown: string;
// 	html: string;
// 	frontmatter: Frontmatter;
// }

// interface Frontmatter {
// 	title: string;
// 	createdAt: string;
// 	description?: string;
// 	draft?: boolean;
// 	excerpt?: string;
// 	updatedAt?: string;
// }
