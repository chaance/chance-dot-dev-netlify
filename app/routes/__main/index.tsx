// import { redirect } from "@remix-run/node";
import { Container } from "~/ui/container";
import { BriefcaseIcon, GlobeIcon } from "~/ui/icons";

import routeStylesUrl from "~/dist/styles/routes/__main/index.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "page--home";

export default function PrimaryLayoutRoute() {
	return (
		<main className={ROOT_CLASS}>
			<header data-ui-id="home-header" className={`${ROOT_CLASS}__header`}>
				<Container>
					<div className={`${ROOT_CLASS}__header`}>
						<h1 id="page-title" className={`${ROOT_CLASS}__title`}>
							<span className="block">Chance</span>{" "}
							<span className="block">the Dev</span>
						</h1>
						<p className={`${ROOT_CLASS}__intro`}>
							Web developer. Open source maker.{" "}
							<span className="sm:block">
								Surfing the web and the west coast.
							</span>
						</p>
						<dl className={`${ROOT_CLASS}__intro-list`}>
							<div className={`${ROOT_CLASS}__intro-item`}>
								<dt>
									<span className="sr-only">Current Work</span>
									<BriefcaseIcon
										title="Current Work"
										aria-hidden
										className={`${ROOT_CLASS}__intro-icon`}
									/>
								</dt>
								<dd>
									<a href="https://remix.run">Remix</a>{" "}
									<span aria-hidden>@</span>
									<span className="sr-only">at</span> Shopify
								</dd>
							</div>
							<div className={`${ROOT_CLASS}__intro-item`}>
								<dt className={`${ROOT_CLASS}__intro-term`}>
									<span className="sr-only">Current Location</span>
									<GlobeIcon
										title="Current Location"
										aria-hidden
										className={`${ROOT_CLASS}__intro-icon`}
									/>
								</dt>
								<dd className={`${ROOT_CLASS}__intro-desc`}>San Diego, CA</dd>
							</div>
						</dl>
					</div>
				</Container>
			</header>
		</main>
	);
}
