import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container } from "~/ui/container";
import { getBlogPost } from "~/lib/blog.server";
import type {
	HeadersFunction,
	MetaFunction,
	LoaderArgs,
} from "@remix-run/node";
import type { BlogPost } from "~/models/blog-post";
import { isAbsoluteUrl, unSlashIt } from "~/lib/utils";

import routeStylesUrl from "~/dist/styles/routes/__main/blog/_slug.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "page--blog";

interface PostData extends BlogPost {
	createdAtFormatted: string;
	createdAtISO: string;
	updatedAtFormatted: string | null;
	updatedAtISO: string | null;
}

export async function loader({ params }: LoaderArgs) {
	let post = await getBlogPost(params.slug!);
	let headers = {
		"Cache-Control": "private, max-age=3600",
		Vary: "Cookie",
	};

	if (!post) {
		throw json(null, { status: 404, headers });
	}

	let createdAt = new Date(post.createdAt);
	let updatedAt = post.updatedAt && new Date(post.updatedAt);

	let fullPost: PostData = {
		...post,
		// temporary...
		title: post.title.replace(/&colon;/g, ":"),
		createdAtFormatted: createdAt.toLocaleString("en-us", {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "America/Los_Angeles",
		}),
		createdAtISO: createdAt.toISOString(),
		updatedAtFormatted:
			updatedAt &&
			updatedAt.toLocaleString("en-us", {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "America/Los_Angeles",
			}),
		updatedAtISO: updatedAt && updatedAt.toISOString(),
	};

	return json({ post: fullPost }, { headers });
}

export let meta: MetaFunction<typeof loader> = (args) => {
	let data = args.data || {};
	let { title, description, excerpt, twitterCard } = data.post || {};
	return {
		title: `${title} | chance.dev`,

		// May be undefined, fix in remix. Will render a pointless tag for now.
		description: (description || excerpt)!,
		"og:description": (description || excerpt)!,
		"twitter:title": `${title} | chance.dev`,
		"twitter:description": (description || excerpt)!,
		"twitter:site": "@chancethedev",
		"twitter:creator": "@chancethedev",
		"twitter:card": twitterCard ? "summary_large_image" : undefined,
		"twitter:image": twitterCard
			? isAbsoluteUrl(twitterCard)
				? twitterCard
				: `https://chance.dev/${unSlashIt(twitterCard)}`
			: undefined,
		"twitter:image:alt": twitterCard ? title : undefined,
	};
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
	return {
		"Cache-Control": loaderHeaders.get("Cache-Control")!,
	};
};

export default function BlogPostRoute() {
	let { post } = useLoaderData<typeof loader>();

	return (
		<div className={ROOT_CLASS}>
			<main className={`${ROOT_CLASS}__main`}>
				<article className={`${ROOT_CLASS}__article`}>
					<Container>
						<header className={`${ROOT_CLASS}__header`}>
							<h1 className={`${ROOT_CLASS}__title`}>{post.title}</h1>
							{/* post.description ? (
								<p _className="text-lg xl:text-xl" className={`${ROOT_CLASS}__desc`}>{post.description}</p>
							) : null */}
							<p className={`${ROOT_CLASS}__meta`}>
								<span>{post.updatedAtISO ? "Updated on" : "Posted on"} </span>
								<time dateTime={post.updatedAtISO || post.createdAtISO}>
									{post.updatedAtFormatted || post.createdAtFormatted}
								</time>
							</p>
						</header>
					</Container>
					<Container>
						<MacOsWindow>
							<div
								className={`${ROOT_CLASS}__content prose prose-markdown`}
								dangerouslySetInnerHTML={{
									__html: post.contentHtml,
								}}
							/>
						</MacOsWindow>
					</Container>
				</article>
			</main>
		</div>
	);
}

// type Mark = RichTextContent["marks"][number]["type"];

// function decorateChild(
// 	node: RichTextContent,
// 	child: React.ReactNode
// ): React.ReactNode {
// 	let marks = node.marks.reduce<Record<Mark, boolean>>(
// 		(allMarks, mark) => ({
// 			...allMarks,
// 			[mark.type]: true,
// 		}),
// 		{ bold: false, underline: false, code: false, italic: false }
// 	);

// 	if (marks.bold) {
// 		child = <strong>{child}</strong>;
// 	}

// 	if (marks.italic) {
// 		child = <em>{child}</em>;
// 	}

// 	if (marks.underline) {
// 		child = <span className="underline">{child}</span>;
// 	}

// 	if (marks.code) {
// 		child = <code>{child}</code>;
// 	}

// 	return child;
// }

function MacOsWindow({ children }: { children: React.ReactNode }) {
	const ROOT_CLASS = "macos-window";
	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__topbar`}>
				<div className={`${ROOT_CLASS}__topbar-inner`}>
					<div className={`${ROOT_CLASS}__actions`}>
						<div className={`${ROOT_CLASS}__action-button`} />
						<div className={`${ROOT_CLASS}__action-button`} />
						<div className={`${ROOT_CLASS}__action-button`} />
					</div>
				</div>
			</div>
			{children}
		</div>
	);
}
