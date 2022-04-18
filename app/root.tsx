import * as React from "react";
import { json, Links, Meta, Outlet, useCatch } from "remix";
import type {
	LinksFunction,
	LoaderFunction,
	MetaFunction,
	HeadersFunction,
} from "remix";
import { Container } from "~/ui/container";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { canUseDOM } from "~/lib/utils";
import { sessionStorage } from "~/lib/session.server";
import { getSeo } from "~/seo";

import stylesUrl from "~/dist/styles/global.css";

let [seoMeta, seoLinks] = getSeo({
	title: "chance.dev",
	description:
		"Thoughts and experiences from a southeastern web dev in southern California",
	twitter: {
		site: "@chancethedev",
		creator: "@chancethedev",
		card: "summary_large_image",
		image: {
			alt: "Chance the Dev: Web developer. Open source maker. Southern fella on the west coast.",
			url: `https://chance.dev/root-twitter-card.jpg`,
		},
	},
});

export let links: LinksFunction = () => {
	return [
		...seoLinks,
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/app-icons/apple-touch-icon.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "512x512",
			href: "/app-icons/android-chrome-512x512.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "192x192",
			href: "/app-icons/android-chrome-192x192.png",
		},
		{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
		{ rel: "alternate icon", href: "/favicon.png", type: "image/png" },
		{ rel: "manifest", href: "/manifest.json" },
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "preload",
			as: "style",
			// rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap",
		},
		// https://www.filamentgroup.com/lab/load-css-simpler/
		{
			id: "google-fonts-preload-link",
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap",
			// set to "all" onload
			media: "print",
		},
		{ rel: "stylesheet", href: stylesUrl },
	];
};

export const meta: MetaFunction = () => {
	return {
		...seoMeta,
	};
};

export let loader: LoaderFunction = async ({ request }) => {
	let session = await sessionStorage.getSession(request.headers.get("Cookie"));
	let scripts = session.get("scripts");
	if (scripts === "enabled" || scripts === "disabled") {
		return json<LoaderData>({ scripts });
	}
	return json(null);
};

export default function Root() {
	return (
		<Document>
			<Layout>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({
	children,
	meta,
}: React.PropsWithChildren<{ meta?: React.ReactNode }>) {
	let [hydrated, setHydrated] = React.useState(false);
	React.useEffect(() => {
		setHydrated(true);
	}, []);

	// let _loaderData = useLoaderData();
	// let loaderData: LoaderData | null = null;
	// if (_loaderData && isValidLoaderData(_loaderData)) {
	// 	loaderData = _loaderData;
	// }

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{meta}
				<Meta />
				<Links />
			</head>
			<body
				data-hydrated={hydrated ? "" : undefined}
				className="bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-50"
			>
				{/* <div className="fixed top-0 right-0 z-10">
					<button
						type="button"
						data-a11y-dialog-show="site-settings-dialog"
						className="rounded-full rotate-0 hover:animate-[superSpin_1200ms_cubic-bezier(0.8,0.08,0.22,0.93)] motion-reduce:animate-none absolute right-4 top-4 sm:right-8 sm:top-8 p-3 -mt-3 -mr-3 sm:p-1 sm:-mt-3 sm:-mr-3 leading-none text-lg text-gray-600 dark:text-gray-300"
						title="Show Site Settings"
					>
						<GearIcon
							aria-hidden
							title={null}
							className="w-5 h-5 sm:w-7 sm:h-7"
						/>
						<span className="sr-only">Show Site Settings</span>
					</button>
				</div> */}
				{children}

				{/* <SettingsDialog
					id="site-settings-dialog"
					currentScriptsSetting={loaderData?.scripts || "disabled"}
				/> */}
				<script type="module" src="/scripts/index.js" />
				{/* enabledScripts ? (
					<React.Fragment>
						<RouteChangeAnnouncement />
						<ScrollRestoration />
						<Scripts />
					</React.Fragment>
				) : null */}
				{/* <LiveReload /> */}
			</body>
		</html>
	);
}

function Layout({ children }: React.PropsWithChildren<{}>) {
	return <div className="chance-dot-dev">{children}</div>;
}

export function CatchBoundary() {
	let caught = useCatch();

	if (process.env.NODE_ENV === "development") {
		/* eslint-disable react-hooks/rules-of-hooks */
		if (!canUseDOM) {
			console.error(caught);
		}
		React.useEffect(() => {
			console.error(caught);
		}, [caught]);
		/* eslint-enable react-hooks/rules-of-hooks */
	}

	let message;
	switch (caught.status) {
		case 401:
			message = (
				<p>
					Oops! Looks like you tried to visit a page that you do not have access
					to.
				</p>
			);
			break;
		case 404:
			message = (
				<p>Oops! Looks like you tried to visit a page that does not exist.</p>
			);
			break;

		default:
			throw new Error(caught.data || caught.statusText);
	}

	return (
		<Document
			meta={
				<title>
					{`Error ${caught.status}: ${caught.statusText} | chance.dev`}
				</title>
			}
		>
			<Layout>
				<div className="flex flex-col min-h-screen">
					<SiteHeader />
					<Container className="flex-auto">
						<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-text dark:gradient-text-dark font-medium leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
							{caught.status}: {caught.statusText}
						</h1>
						{message}
					</Container>
					<SiteFooter />
				</div>
			</Layout>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.log(error);
	return (
		<Document meta={<title>Danger, Will Robinson! 500! | chance.dev</title>}>
			<Layout>
				<div className="flex flex-col min-h-screen">
					<SiteHeader />
					<Container className="flex-auto">
						<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-text dark:gradient-text-dark font-medium leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
							Oh no!
						</h1>
						<p>
							Something went wrong and I'm not quite sure what! Maybe go outside
							for a bit and hopefully I'll get it fixed by the time you get
							back.
						</p>
					</Container>
					<SiteFooter />
				</div>
			</Layout>
		</Document>
	);
}

// function isValidLoaderData(data: any): data is LoaderData {
// 	return (
// 		isObject(data) &&
// 		(data.scripts === "enabled" || data.scripts === "disabled")
// 	);
// }

interface LoaderData {
	scripts: "enabled" | "disabled";
}
