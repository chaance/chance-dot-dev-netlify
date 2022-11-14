import * as React from "react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "~/ui/icons";
import cx from "clsx";
import { Container } from "~/ui/container";

const ROOT_CLASS = "cs--site-footer";

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
	includeTopMargin = true,
}) => {
	return (
		<footer id={id as string} className={ROOT_CLASS}>
			<Container purpose="footer">
				<div className={`${ROOT_CLASS}__inner`}>
					<nav aria-label="Social" className={`${ROOT_CLASS}__nav`}>
						{/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
						<ul className={`${ROOT_CLASS}__nav-list`} role="list">
							{navLinks.map(({ href, label, icon }) => {
								return (
									// eslint-disable-next-line jsx-a11y/no-redundant-roles
									<li
										key={label}
										className={`${ROOT_CLASS}__nav-item`}
										role="listitem"
									>
										<a
											href={href}
											aria-label={label}
											className={`${ROOT_CLASS}__nav-link`}
											title={label}
										>
											<span className={`${ROOT_CLASS}__nav-link-icon`}>
												{icon}
											</span>
											<span className={`${ROOT_CLASS}__nav-link-label`}>
												{label}
											</span>
										</a>
									</li>
								);
							})}
						</ul>
					</nav>
					<p className={`${ROOT_CLASS}__copyright`}>
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
	includeTopMargin?: boolean;
}

export type { SiteFooterProps };
export { SiteFooter };

interface SiteNavLink {
	label: string;
	href: string;
	icon: React.ReactElement;
}
