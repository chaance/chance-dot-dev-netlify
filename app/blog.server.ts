import path from "path";
import fs from "fs/promises";
import invariant from "tiny-invariant";
import { typedBoolean } from "~/lib/utils";
import { dataPath } from "~/data.server";
import { compileMdx } from "~/mdx.server";
import {
	getSlugFromPath,
	parseMarkdown,
	isMarkdownPostFrontmatter,
} from "~/md.server";
import type { MarkdownPost } from "~/md.server";
import type { BlogPost } from "~/models";
import { isDirectory } from "~/lib/node.server";

// Relative to where this code ends up in the build, *not* the source
export const blogPath = path.join(dataPath, "blog");

type CompiledMdxBlog = Awaited<ReturnType<typeof compileMdx>>;
export async function getMdxBlogPosts() {
	let blogDirectoryContents = (await fs.readdir(blogPath)).map((p) =>
		path.join(blogPath, p)
	);
	let compiledBlogEntryPromises: Promise<CompiledMdxBlog>[] = [];
	for (let fileOrDirectory of blogDirectoryContents) {
		if (/\.mdx?$/.test(path.basename(fileOrDirectory))) {
			compiledBlogEntryPromises.push(
				compileMdx({
					filePath: fileOrDirectory,
					slug: path.basename(fileOrDirectory).replace(/\.mdx?$/, ""),
				})
			);
			continue;
		}
		if (await isDirectory(fileOrDirectory)) {
			let innerFiles = await fs.readdir(fileOrDirectory);
			let indexRegex = new RegExp(`${path.sep}index.mdx?$`);
			let found: string | undefined;
			if ((found = innerFiles.find((path) => indexRegex.test(path)))) {
				compiledBlogEntryPromises.push(
					compileMdx({
						filePath: found,
						cwd: fileOrDirectory,
						slug: path.basename(fileOrDirectory),
					})
				);
				continue;
			}
		}
	}
	return await Promise.all(compiledBlogEntryPromises);
}

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

////////////////////////////////

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
	let result = await parseMarkdown(contents, slug);
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
