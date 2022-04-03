import * as React from "react";
import {
	Links,
	// LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
} from "remix";
import type { LinksFunction, MetaFunction } from "remix";
import { RouteChangeAnnouncement } from "~/ui/route-change-announcement";
import { Container } from "~/ui/container";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { canUseDOM } from "~/lib/utils";

import stylesUrl from "~/dist/styles/global.css";

export let links: LinksFunction = () => {
	return [
		// ...seoLinks,
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
		{ rel: "stylesheet", href: stylesUrl },
	];
};

export const meta: MetaFunction = () => {
	return {
		title: "New Remix App",
	};
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
	let fbPreloadLink = React.useRef<HTMLLinkElement>(null);
	let [hydrated, setHydrated] = React.useState(false);
	React.useEffect(() => {
		setHydrated(true);
	}, []);
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				{meta}
				<Meta />
				<Links />
				{/* https://www.filamentgroup.com/lab/load-css-simpler/ */}
				<link
					ref={fbPreloadLink}
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap"
					media="print"
					onLoad={() => {
						fbPreloadLink.current!.media = "all";
					}}
				/>
			</head>
			<body
				data-hydrated={hydrated ? "" : undefined}
				className="bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-50"
			>
				{children}
				<RouteChangeAnnouncement />
				<ScrollRestoration />
				<Scripts />
				{/* <LiveReload /> */}
			</body>
		</html>
	);
}

function Layout({ children }: React.PropsWithChildren<{}>) {
	return (
		<div className="chance-dot-dev flex flex-col min-h-screen">{children}</div>
	);
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
				<SiteHeader />
				<Container className="flex-auto">
					<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-heading dark:gradient-heading-dark leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
						{caught.status}: {caught.statusText}
					</h1>
					{message}
				</Container>
				<SiteFooter />
			</Layout>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.log(error);
	return (
		<Document meta={<title>Danger, Will Robinson! 500! | chance.dev</title>}>
			<Layout>
				<SiteHeader />
				<Container className="flex-auto">
					<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-heading dark:gradient-heading-dark leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
						Oh no!
					</h1>
					<p>
						Something went wrong and I'm not quite sure what! Maybe go outside
						for a bit and hopefully I'll get it fixed by the time you get back.
					</p>
				</Container>
				<SiteFooter />
			</Layout>
		</Document>
	);
}
