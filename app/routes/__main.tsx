import { Outlet, useLocation } from "@remix-run/react";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";

import routeStylesUrl from "~/dist/styles/routes/__main.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "layout--main";

export default function MainLayout() {
	return (
		<PrimaryLayout>
			<Outlet />
		</PrimaryLayout>
	);
}

function PrimaryLayout({ children }: React.PropsWithChildren<{}>) {
	let location = useLocation();
	let isFixed = location.pathname === "/";
	return (
		<div className={ROOT_CLASS}>
			<div className={`${ROOT_CLASS}__header`}>
				<SiteHeader
					position={isFixed ? "fixed" : "sticky"}
					includeBottomMargin={!isFixed}
				/>
			</div>
			<div className={`${ROOT_CLASS}__main`}>{children}</div>
			<div className={`${ROOT_CLASS}__footer`}>
				<SiteFooter includeTopMargin={false} />
			</div>
		</div>
	);
}
