import * as React from "react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "~/ui/icons";
import cx from "clsx";
import { Container } from "~/ui/container";

const navLinks: SiteNavLink[] = [
	{
		label: "Twitter",
		href: "https://twitter.com/chancethedev/",
		icon: <TwitterIcon titleId="footer-icon-twitter" aria-hidden />,
	},
	{
		label: "GitHub",
		href: "https://www.github.com/chaance/",
		icon: <GitHubIcon titleId="footer-icon-github" aria-hidden />,
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/chaance/",
		icon: <LinkedInIcon titleId="footer-icon-linkedin" aria-hidden />,
	},
];

const SiteFooter: React.FC<SiteFooterProps> = ({
	id,
	className,
	includeTopMargin = true,
}) => {
	return (
		<footer
			id={id as string}
			className={cx(
				className,
				"w-full py-16 text-gray-600 dark:text-gray-400",
				{
					"mt-10 sm:mt-14 md:mt-20": includeTopMargin,
				}
			)}
		>
			<Container>
				<div className="flex flex-col sm:items-center sm:justify-center gap-4">
					<nav aria-label="Social" className="w-full sm:w-auto">
						<ul className="leading-none list-none flex items-center ui--site-footer__nav-menu">
							{navLinks.map(({ href, label, icon }) => {
								return (
									<li key={label} className="font-bold uppercase">
										<a
											href={href}
											aria-label={label}
											className="ui--site-footer__nav-link flex place-content-center rounded-full md:rounded-none fill-current sm-down:outline-offset-0"
											title={label}
										>
											<span className="md:hidden">{icon}</span>
											<span className="hidden md:inline">{label}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</nav>
					<p className="uppercase text-sm text-gray-400 dark:text-gray-500">
						&copy; nobody cares.{" "}
						<span className="block sm:inline">
							All rights reserved, I guess.
						</span>
					</p>
				</div>
			</Container>
		</footer>
	);
};

interface SiteFooterProps {
	id?: string | number;
	className?: string | number;
	includeTopMargin?: boolean;
}

export type { SiteFooterProps };
export { SiteFooter };

interface SiteNavLink {
	label: string;
	href: string;
	icon: React.ReactElement;
}
