import * as React from "react";
import { json } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	ScrollRestoration,
	Scripts,
	useCatch,
	useTransition,
	useFetchers,
} from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Container } from "~/ui/container";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { canUseDOM } from "~/lib/utils";
import { serverSessionStorage } from "~/lib/session.server";
import { getSeo } from "~/lib/seo";
import { RouteChangeAnnouncement } from "~/ui/primitives/route-change-announcement";
import { RootProvider } from "~/lib/context";
import { useIsHydrated } from "~/lib/react";
import NProgress from "nprogress";

import appStylesUrl from "~/dist/styles/app.css";
import fontStylesUrl from "~/dist/styles/fonts.css";

const DISABLE_JS = false;

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
			url: `https://chance.dev/images/root-twitter-card.jpg`,
		},
	},
});

export function links() {
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

		{
			rel: "preload",
			as: "font",
			href: "/fonts/armingrotesk-400.woff2",
			type: "font/woff2",
			crossOrigin: "",
		},

		{ rel: "stylesheet", href: fontStylesUrl },
		{ rel: "stylesheet", href: appStylesUrl },
	];
}

export const meta: MetaFunction = () => {
	return {
		...seoMeta,
	};
};

export let loader: LoaderFunction = async ({ request }) => {
	let session = await serverSessionStorage.getSession(
		request.headers.get("Cookie")
	);

	let data: LoaderData = {
		scripts: null,
		requestInfo: {
			origin: getDomainUrl(request),
		},
	};

	let scripts = session.get("scripts");
	if (scripts === "enabled" || scripts === "disabled") {
		data.scripts = scripts;
	}
	return json<LoaderData>(data);
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
	useProgressBar();
	let hydrated = useIsHydrated();

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
			<body data-hydrated={hydrated ? "" : undefined}>
				<RootProvider hydrated={hydrated}>
					{children}
					{!DISABLE_JS ? (
						<React.Fragment>
							<RouteChangeAnnouncement />
							<ScrollRestoration />
							<Scripts />
						</React.Fragment>
					) : null}
				</RootProvider>
			</body>
		</html>
	);
}

function Layout({ children }: React.PropsWithChildren<{}>) {
	return <div className="chance-dot-dev">{children}</div>;
}

export function CatchBoundary() {
	let caught = useCatch();

	if (!canUseDOM) {
		if (process.env.NODE_ENV === "development") {
			console.error(caught);
		}
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
					<div className="flex-auto">
						<Container>
							<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-text dark:gradient-text-dark font-medium leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
								{caught.status}: {caught.statusText}
							</h1>
							{message}
						</Container>
					</div>
					<SiteFooter />
				</div>
			</Layout>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	if (!canUseDOM) {
		if (process.env.NODE_ENV === "development") {
			console.error(error);
		}
	}
	return (
		<Document meta={<title>Danger, Will Robinson! 500! | chance.dev</title>}>
			<Layout>
				<div className="flex flex-col min-h-screen">
					<SiteHeader />
					<div className="flex-auto">
						<Container>
							<h1 className="text-3xl md:text-4xl xl:text-5xl gradient-text dark:gradient-text-dark font-medium leading-tight md:leading-tight xl:leading-tight mb-2 xl:mb-4">
								Oh no!
							</h1>
							<p>
								Something went wrong and I'm not quite sure what! Maybe go
								outside for a bit and hopefully I'll get it fixed by the time
								you get back.
							</p>
						</Container>
					</div>
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
	scripts: "enabled" | "disabled" | null;
	requestInfo: {
		origin: string;
	};
}

function getDomainUrl(request: Request) {
	const host =
		request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
	if (!host) {
		throw new Error("Could not determine domain URL.");
	}
	const protocol = host.includes("localhost") ? "http" : "https";
	return `${protocol}://${host}`;
}

function useProgressBar() {
	let transition = useTransition();
	let fetchers = useFetchers();
	let state: "idle" | "busy" = React.useMemo(() => {
		let states = [
			transition.state,
			...fetchers.map((fetcher) => fetcher.state),
		];
		if (states.every((state) => state === "idle")) {
			return "idle";
		}
		return "busy";
	}, [transition.state, fetchers]);

	let nProgressRef = React.useRef<typeof NProgress | null>(null);
	React.useEffect(() => {
		if (nProgressRef.current === null) {
			nProgressRef.current = NProgress.configure({ showSpinner: false });
		}
	}, []);

	React.useEffect(() => {
		switch (state) {
			case "busy":
				nProgressRef.current?.start();
				break;
			case "idle":
				nProgressRef.current?.done();
				break;
		}
	}, [state]);
}
