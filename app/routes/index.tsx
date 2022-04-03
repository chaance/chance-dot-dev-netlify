import type { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { H1, Section } from "~/ui/heading";
import { Container } from "~/ui/container";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { Link } from "~/ui/link";
import { getPublishedBlogPostsMarkdown } from "~/blog.server";

interface FeedPost {
	title: string;
	slug: string;
	createdAtISO: string;
	createdAtFormatted: string;
}

interface LoaderData {
	posts: FeedPost[];
}

export let loader: LoaderFunction = async ({ request }) => {
	let headers = {
		"Cache-Control": "private, max-age=3600",
		Vary: "Cookie",
	};
	let rawPosts = await getPublishedBlogPostsMarkdown();

	if (!rawPosts) {
		throw new Response("Not found", {
			status: 404,
		});
	}

	return json<LoaderData>(
		{
			posts: rawPosts.map((post) => {
				let createdAt = new Date(post.createdAt);
				return {
					title: post.title,
					slug: post.slug,
					createdAtFormatted: createdAt.toLocaleString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
						timeZone: "America/Los_Angeles",
					}),
					createdAtISO: createdAt.toISOString(),
				};
			}),
		},
		{ headers }
	);
};

export default function BlogIndex() {
	let { posts } = useLoaderData<LoaderData>();

	return (
		<div className="route--index flex flex-col min-h-screen">
			<SiteHeader />
			<main className="flex-auto">
				<h1 className="sr-only">Welcome to chance.dev</h1>
				<Container>
					<Section>
						<H1 className="mb-14 font-bold">Notes</H1>
						<div className="flex flex-col gap-10 sm:gap-14 md:gap-16">
							{posts.map((post) => {
								return (
									<article key={post.slug}>
										<header className="mb-4">
											<h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
												<Link
													className="gradient-heading dark:gradient-heading-dark hover:underline hover:decoration-blue-500 dark:hover:decoration-blue-400"
													to={"blog/" + post.slug}
													rel="bookmark"
												>
													{post.title}
												</Link>
											</h2>
											<p className="text-sm text-gray-700 dark:text-gray-200">
												<span>Posted on </span>
												<time dateTime={post.createdAtISO}>
													{post.createdAtFormatted}
												</time>
											</p>
										</header>
									</article>
								);
							})}
						</div>
					</Section>
				</Container>
			</main>
			<SiteFooter />
		</div>
	);
}
