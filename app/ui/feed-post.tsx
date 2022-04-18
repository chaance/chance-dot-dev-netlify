import { H3 } from "~/ui/heading";
import { Link } from "~/ui/link";

export function FeedPost({
	permalink,
	title,
	excerpt,
	publishDateFormatted,
	publishDateISO,
}: {
	permalink: string;
	title: string;
	excerpt: string;
	publishDateFormatted: string;
	publishDateISO: string;
}) {
	return (
		<article className="">
			<header className="mb-4">
				<H3 className="text-xl sm:text-2xl md:text-3xl font-bold">
					<Link
						className="ui--feed-post__title-link gradient-text dark:gradient-text-dark font-medium hover:underline hover:decoration-blue-500 dark:hover:decoration-blue-400"
						to={permalink}
						rel="bookmark"
					>
						{title}
					</Link>
				</H3>
				<p className="text-sm text-gray-700 dark:text-gray-200">
					<span>Posted on </span>
					<time className="ui--feed-post__date-time" dateTime={publishDateISO}>
						{publishDateFormatted}
					</time>
				</p>
			</header>

			<div className="ui--feed-post__excerpt">
				{excerpt
					.trim()
					.split("\n")
					.map((line, i) => (
						<p key={i}>{line}</p>
					))}
			</div>
		</article>
	);
}
