import * as React from "react";
import { Outlet } from "remix";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";

export default function PrimaryLayoutRoute() {
	return (
		<PrimaryLayout>
			<Outlet />
		</PrimaryLayout>
	);
}

function PrimaryLayout({ children }: React.PropsWithChildren<{}>) {
	return (
		<div className="md-down:bg-white md-down:dark:bg-black">
			<SiteHeader />
			<div>{children}</div>
			<SiteFooter includeTopMargin={false} />
		</div>
	);
}
