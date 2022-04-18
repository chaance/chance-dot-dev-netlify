// import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { Container } from "~/ui/container";
import { BriefcaseIcon, GlobeIcon } from "~/ui/icons";

// export let loader: LoaderFunction = async () => {
// 	return redirect("/blog");
// };

function PrimaryLayout({ children }: React.PropsWithChildren<{}>) {
	return (
		<div className="flex flex-col min-h-screen">
			<SiteHeader hideLogo />
			<div className="flex-auto">{children}</div>
			<SiteFooter includeTopMargin={false} />
		</div>
	);
}

export default function PrimaryLayoutRoute() {
	return (
		<PrimaryLayout>
			<Container className="flex-1">
				<main>
					<h1 className="sr-only">Chance the Dev</h1>
					<section aria-labelledby="page-title">
						<header className="max-w-[22rem] sm:max-w-none">
							<h2
								id="page-title"
								className="text-blue-800 dark:text-blue-100 relative font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 lg:mb-7"
							>
								<span className="sr-only">About </span>
								Chance
								<span className="italic">
									{" "}
									<span className="inline-block -z-10 relative before:absolute before:-inset-x-2 before:-inset-y-1 before:block before:-skew-y-1 -ml-3 -mr-3 before:bg-blue-100 dark:before:bg-blue-900 before:opacity-80">
										<span className="relative skew-y-1">
											the <span className="inline-block -ml-3">Dev</span>
										</span>
									</span>
								</span>
							</h2>
							<p className="mb-4 text-gray-700 dark:text-gray-200 sm:text-lg md:text-2xl xl:text-2xl">
								Web developer. Open source maker.{" "}
								<span className="sm:block">
									Southern fella on the west coast.
								</span>
							</p>
							<dl className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:text-base mt-6 md:mt-8">
								<div className="flex gap-2">
									<dt>
										<span className="sr-only">Current Work</span>
										<BriefcaseIcon
											title="Current Work"
											aria-hidden
											className="w-5 h-5 sm:w-6 sm:h-6 opacity-50"
										/>
									</dt>
									<dd>
										<a href="https://remix.run">Remix Software</a>
									</dd>
								</div>
								<div className="flex gap-2">
									<dt>
										<span className="sr-only">Current Location</span>
										<GlobeIcon
											title="Current Location"
											aria-hidden
											className="w-5 h-5 sm:w-6 sm:h-6 opacity-50"
										/>
									</dt>
									<dd>San Diego, CA</dd>
								</div>
							</dl>
						</header>
					</section>
				</main>
			</Container>
		</PrimaryLayout>
	);
}
