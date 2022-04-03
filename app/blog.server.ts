import fs from "fs/promises";
import LRUCache from "lru-cache";
import path from "path";
import invariant from "tiny-invariant";
import { dataPath } from "~/data.server";
import { parseMarkdown } from "~/md.server";
import type { BlogPost } from "~/models";
import { isDirectory, readableFileExists } from "~/lib/node.server";
import { isBoolean, isObject, isString, typedBoolean } from "~/lib/utils";

// TODO: Some of these functions are a bit questionable, wrote them too late at
// night 😵‍💫 Need to refactor a few things but it works for now.

const postsCache = new LRUCache<string, BlogPost>({
	max: Math.round((1024 * 1024 * 12) / 10),
	maxSize: 1024 * 1024 * 12, // 12mb
	sizeCalculation(value, key) {
		return JSON.stringify(value).length + (key ? key.length : 0);
	},
});

// Relative to where this code ends up in the build, *not* the source
export const blogPath = path.join(dataPath, "blog");

async function getMdBlogPost(
	slug: string,
	type?: "index" | "file"
): Promise<BlogPost | null> {
	let cached = postsCache.get(slug);
	if (cached) {
		return cached;
	}

	let possiblePath = path.join(blogPath, slug);
	let filePath: string;

	if (type === "index" || (await isDirectory(possiblePath))) {
		filePath = path.join(possiblePath, "index.md");
	} else if (
		type === "file" ||
		(await readableFileExists(possiblePath + ".md"))
	) {
		filePath = possiblePath + ".md";
	} else {
		// No post, sorry homie
		return null;
	}

	let markdown = await getBlogPostMarkdown(filePath);
	if (!markdown) {
		return null;
	}

	let post = getBlogPostFromMarkdown(markdown);
	postsCache.set(slug, post);
	return post;
}

export { getMdBlogPost as getBlogPost };

function getBlogPostFromMarkdown(markdownData: MarkdownPost): BlogPost {
	return {
		title: markdownData.title,
		createdAt: new Date(markdownData.createdAt),
		updatedAt: markdownData.updatedAt ? new Date(markdownData.updatedAt) : null,
		postTypeId: "BLOG",
		contentHtml: markdownData.html,
		contentMarkdown: markdownData.markdown,
		description: markdownData.description || null,
		excerpt: markdownData.excerpt || null,
		id: uuid(),
		image: "TODO",
		imageAlt: "TODO",
		slug: markdownData.slug,
	};
}

function uuid() {
	return "TODO";
}

async function getPublishedBlogPostsMarkdown(): Promise<Array<BlogPost>> {
	let blogDirectoryContents = (await fs.readdir(blogPath)).map((p) =>
		path.join(blogPath, p)
	);
	let listingPromises: Array<Promise<BlogPost | null>> = [];
	for (let fileOrDirectory of blogDirectoryContents) {
		if (/\.md$/.test(path.basename(fileOrDirectory))) {
			let slug = getSlugFromPath(fileOrDirectory);
			listingPromises.push(getMdBlogPost(slug, "file"));
		} else if (
			await readableFileExists(path.join(fileOrDirectory, "index.md"))
		) {
			let slug = getSlugFromPath(path.join(fileOrDirectory, "index.md"));
			listingPromises.push(getMdBlogPost(slug, "index"));
		}
	}

	let listings = (await Promise.all(listingPromises)).filter(typedBoolean);

	return listings.sort((a, b) => {
		let bTime = new Date(b.createdAt).getTime();
		let aTime = new Date(a.createdAt).getTime();
		return bTime - aTime;
	});
}
export { getPublishedBlogPostsMarkdown as getPublishedBlogPosts };

export function getSlugFromPath(filePath: string) {
	return new RegExp(`${path.sep}index.md$`).test(filePath)
		? path.basename(path.dirname(filePath))
		: path.basename(filePath, ".md");
}

////////////////////////////////

export function isMarkdownPostFrontmatter(obj: any): obj is Frontmatter {
	return (
		isObject(obj) &&
		isString(obj.title) &&
		isString(obj.createdAt) &&
		(isString(obj.description) || obj.description === undefined) &&
		(isString(obj.excerpt) || obj.excerpt === undefined) &&
		(isString(obj.updatedAt) || obj.updatedAt === undefined) &&
		(isBoolean(obj.draft) || obj.draft === undefined)
	);
}

export interface Frontmatter {
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

export async function getBlogPostMarkdown(
	filePath: string
): Promise<MarkdownPost | null> {
	let contents: string;
	let slug = getSlugFromPath(filePath);
	try {
		contents = (await fs.readFile(filePath)).toString();
	} catch (e) {
		return null;
	}
	let result = await parseMarkdown(
		slug,
		contents,
		isMarkdownPostFrontmatter,
		slug
	);
	if (!result) {
		return null;
	}

	let { frontmatter, html, markdown } = result;

	invariant(
		isMarkdownPostFrontmatter(frontmatter),
		`Invalid post frontmatter in ${path.basename(
			filePath
		)}. Received: ${JSON.stringify(frontmatter)}`
	);

	let post = {
		...frontmatter,
		markdown,
		slug,
		html,
	};
	return post;
}
