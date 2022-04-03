import path from "path";
import fs from "fs/promises";
import invariant from "tiny-invariant";
import { isBoolean, isObject, isString, typedBoolean } from "~/lib/utils";
import { dataPath } from "~/data.server";
import { parseMarkdown } from "~/md.server";
import type { BlogPost } from "~/models";
import { isDirectory } from "~/lib/node.server";

// TODO: Some of these functions are a bit questionable, wrote them too late at
// night 😵‍💫 Need to refactor a few things but it works for now.

// Relative to where this code ends up in the build, *not* the source
export const blogPath = path.join(dataPath, "blog");

export async function getMdBlogPost(slug: string): Promise<BlogPost | null> {
	let filePath = path.join(blogPath, slug);
	if (await isDirectory(filePath)) {
		filePath =
			filePath.replace(new RegExp(`${path.sep}$`), "") + path.sep + "index.md";
	} else {
		filePath += ".md";
	}

	let markdown = await getBlogPostMarkdown(filePath);
	if (!markdown) {
		return null;
	}
	return getBlogPostFromMarkdown(markdown);
}

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

export async function getPublishedBlogPostsMarkdown(): Promise<
	Array<MarkdownPost>
> {
	let blogDirectoryContents = (await fs.readdir(blogPath)).map((p) =>
		path.join(blogPath, p)
	);
	let listingPromises: Array<Promise<MarkdownPost | null>> = [];

	for (let fileOrDirectory of blogDirectoryContents) {
		if (/\.md$/.test(path.basename(fileOrDirectory))) {
			listingPromises.push(getBlogPostMarkdown(fileOrDirectory));
			continue;
		}
		if (await isDirectory(fileOrDirectory)) {
			listingPromises.push(getBlogPostMarkdown(fileOrDirectory));
			continue;
		}
	}

	let listings = (await Promise.all(listingPromises)).filter(typedBoolean);

	return listings.sort((a, b) => {
		let bTime = new Date(b.createdAt).getTime();
		let aTime = new Date(a.createdAt).getTime();
		return bTime - aTime;
	});
}

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
	let result = await parseMarkdown(contents, isMarkdownPostFrontmatter, slug);
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
