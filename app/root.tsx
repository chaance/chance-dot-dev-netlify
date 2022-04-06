import * as React from "react";
import {
	json,
	Form,
	Links,
	// LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
	useLoaderData,
	useLocation,
} from "remix";
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";
import { RouteChangeAnnouncement } from "~/ui/route-change-announcement";
import { Container } from "~/ui/container";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { CloseIcon, GearIcon } from "~/ui/icons";
import { canUseDOM } from "~/lib/utils";
import { sessionStorage } from "~/lib/session.server";
import { isObject } from "~/lib/utils";
import { getSeo } from "~/seo";

import stylesUrl from "~/dist/styles/global.css";
import { Switch } from "./ui/switch";

let [seoMeta, seoLinks] = getSeo({
	title: "chance.dev",
	description:
		"Thoughts and experiences from a southeastern web dev in southern California",
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
	let fbPreloadLink = React.useRef<HTMLLinkElement>(null);
	let [hydrated, setHydrated] = React.useState(false);
	React.useEffect(() => {
		setHydrated(true);
	}, []);

	let _loaderData = useLoaderData();
	let loaderData: LoaderData | null = null;
	if (_loaderData && isValidLoaderData(_loaderData)) {
		loaderData = _loaderData;
	}

	let enabledScripts = loaderData?.scripts === "enabled";

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
				<div className="fixed top-0 right-0 z-10">
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
				</div>
				{children}

				<SettingsDialog
					id="site-settings-dialog"
					currentScriptsSetting={loaderData?.scripts || "disabled"}
				/>

				<script type="module" src="/scripts/a11y-dialog.min.js" />
				<script type="module" src="/scripts/index.js" />
				{enabledScripts ? (
					<React.Fragment>
						<RouteChangeAnnouncement />
						<ScrollRestoration />
						<Scripts />
					</React.Fragment>
				) : null}
				{/* <LiveReload /> */}
			</body>
		</html>
	);
}

function SettingsDialog({
	id,
	currentScriptsSetting,
}: {
	id: string;
	currentScriptsSetting: "enabled" | "disabled";
}) {
	const TITLE_ID = `${id}--title`;
	let location = useLocation();
	let scriptsEnabled = currentScriptsSetting === "enabled";
	console.log({ currentScriptsSetting });

	return (
		<div
			className="z-20"
			id={id}
			role="dialog"
			aria-hidden
			aria-modal
			tabIndex={-1}
			aria-labelledby={TITLE_ID}
			data-a11y-dialog-root
		>
			<div className="" data-a11y-dialog-overlay data-a11y-dialog-hide></div>
			<div
				role="document"
				data-a11y-dialog-content
				className="p-4 pt-7 md:p-8 md:pt-12 bg-gray-50 dark:bg-gray-950 sm:border-[1px] sm:border-gray-400 sm:dark:border-gray-600 sm:rounded-md"
			>
				<button
					type="button"
					data-a11y-dialog-hide
					aria-label="Close settings window"
					title="Close settings window"
					className="absolute right-4 top-4 p-3 -mt-3 -mr-3 sm:top-6 sm:right-6 sm:p-1 sm:-mt-3 sm:-mr-3 leading-none text-lg z-10"
				>
					<CloseIcon
						title={null}
						className="text-current w-5 h-5 sm:w-7 sm:h-7"
					/>
				</button>
				<div className="prose mb-3 sm:mb-6 ml-4 sm:ml-6">
					<h1 id={TITLE_ID} className="text-xl sm:text-2xl font-bold">
						Site Settings
					</h1>
				</div>

				<Form
					reloadDocument
					method="post"
					action="/toggle-scripts"
					className="accent-blue-600 dark:accent-blue-400"
				>
					<div className="flex flex-col gap-4 sm:gap-8">
						{/* PROGRESSIVE ENHANCEMENT */}
						<div role="group" aria-labelledby={`${id}--prog`}>
							<h2
								className="mb-1 sm:mb-2 ml-4 sm:ml-6 text-sm uppercase"
								id={`${id}--prog`}
							>
								Progressive Enhancement
							</h2>
							<div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-md">
								<div className="flex flex-col">
									<div>
										<p id={`${id}--scripts-desc`}>
											This site may optionally load scripts that can enhance the
											experience.{" "}
											<span className="font-bold">
												These scripts are currently {currentScriptsSetting}.
											</span>
										</p>
										<label className="flex justify-between items-center py-4">
											<span>Enable scripts</span>
											<SwitchWithFallback
												aria-describedby={`${id}--scripts-desc`}
												fallback={!scriptsEnabled}
												name="toggle"
												defaultChecked={currentScriptsSetting === "enabled"}
											/>
										</label>
									</div>
								</div>
							</div>
						</div>

						<div>
							<input type="hidden" name="_redirect" value={location.pathname} />
							<button
								type="submit"
								className="text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 font-bold py-3 px-5 rounded transition-colors"
							>
								Save Preferences
							</button>
						</div>
					</div>
				</Form>
			</div>
		</div>
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

function SwitchWithFallback({
	fallback,
	...props
}: Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
	fallback: boolean;
}) {
	return fallback ? (
		<input type="checkbox" {...props} />
	) : (
		<Switch {...props} />
	);
}

function isValidLoaderData(data: any): data is LoaderData {
	return (
		isObject(data) &&
		(data.scripts === "enabled" || data.scripts === "disabled")
	);
}

interface LoaderData {
	scripts: "enabled" | "disabled";
}
