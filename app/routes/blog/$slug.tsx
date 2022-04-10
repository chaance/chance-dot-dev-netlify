import { json, useLoaderData } from "remix";
import { Spacer } from "~/ui/spacer";
import { Container } from "~/ui/container";
import { getBlogPost } from "~/blog.server";
import type { MetaFunction, LoaderFunction } from "remix";
import type { BlogPost } from "~/models";

interface PostData extends BlogPost {
	createdAtFormatted: string;
	createdAtISO: string;
	updatedAtFormatted: string | null;
	updatedAtISO: string | null;
}

interface LoaderData {
	post: PostData;
}

export let loader: LoaderFunction = async ({ params, request }) => {
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

	return json<LoaderData>(
		{
			post: {
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
			},
		},
		{ headers }
	);
};

export let meta: MetaFunction = (args) => {
	let data: LoaderData = args.data || {};
	let { title, description, excerpt } = data.post || {};
	return {
		title: `${title} | chance.dev`,

		// May be undefined, fix in remix. Will render a pointless tag for now.
		description: (description || excerpt)!,
	};
};

export default function BlogPostRoute() {
	let { post } = useLoaderData() as LoaderData;

	return (
		<div className="">
			<Spacer size={10} />
			<main>
				<article>
					<Container>
						<header className="mb-12 md:mb-14 xl:mb-16">
							<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-heading dark:gradient-heading-dark leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
								{post.title}
							</h1>
							{/* post.description ? (
								<p className="text-lg xl:text-xl">{post.description}</p>
							) : null */}
							<div className="mt-6 lg:mt-10 mb-3 lg:mb-4" />
							<p className="text-sm text-gray-700 dark:text-gray-200">
								<span>{post.updatedAtISO ? "Updated on" : "Posted on"} </span>
								<time dateTime={post.updatedAtISO || post.createdAtISO}>
									{post.updatedAtFormatted || post.createdAtFormatted}
								</time>
							</p>
						</header>
					</Container>
					<Container>
						<div className="lg:drop-shadow-xl lg:bg-white lg:dark:bg-gray-950 lg:-mx-28 lg:overflow-hidden lg:rounded-xl">
							<div className="hidden lg:block  bg-white lg:bg-white lg:dark:bg-gray-950  -mx-5">
								<div className="mx-5">
									<div className="h-7 p-2 border-b-[1px] border-b-gray-200 dark:border-b-gray-800">
										<div className="flex gap-2">
											<div className="h-3 w-3 rounded-full bg-red-500 border-[1px] border-red-600" />
											<div className="h-3 w-3 rounded-full bg-yellow-500 border-[1px] border-yellow-600" />
											<div className="h-3 w-3 rounded-full bg-green-500 border-[1px] border-green-600" />
										</div>
									</div>
								</div>
							</div>
							<div
								className="prose dark:prose-dark lg:prose-markdown lg:dark:prose-markdown-dark lg:p-28"
								dangerouslySetInnerHTML={{
									__html: post.contentHtml,
								}}
							></div>
						</div>
					</Container>
				</article>
			</main>
			<Spacer size={10} />
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
