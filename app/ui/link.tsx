/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from "react";
import { Link as ReactRouterLink, NavLink as ReactRouterNavLink } from "remix";
import type {
	LinkProps as ReactRouterLinkProps,
	NavLinkProps as ReactRouterNavLinkProps,
} from "remix";
import { isAbsoluteUrl } from "~/lib/utils";
import cx from "clsx";

function makeLink(
	Component: typeof ReactRouterLink | typeof ReactRouterNavLink,
	baseClassName: string,
	displayName: string
) {
	type P = typeof Component extends typeof ReactRouterNavLink
		? NavLinkProps
		: LinkProps;

	const Link = React.forwardRef<HTMLAnchorElement, P>((props, ref) => {
		if (typeof props.to === "string" && isAbsoluteUrl(props.to)) {
			let { caseSensitive, className, end, style, ...domProps } =
				props as NavLinkProps;
			style = typeof style === "function" ? style({ isActive: false }) : style;
			className =
				typeof className === "function"
					? className({ isActive: false })
					: className;
			return (
				<a
					{...domProps}
					data-type="absolute"
					className={cx(className, baseClassName)}
					style={style}
					ref={ref}
					href={props.to}
				/>
			);
		}

		let className: P["className"];
		if (typeof props.className === "function") {
			let c = props.className as (props: { isActive: boolean }) => string;
			className = ((args: { isActive: boolean }) =>
				cx(c(args), baseClassName, {
					[`${baseClassName}--active`]: args.isActive,
				}) as unknown) as any;
		} else {
			className = cx(props.className, baseClassName);
		}

		// @ts-ignore
		return <Component {...props} className={className} ref={ref} />;
	});
	Link.displayName = displayName;
	return Link;
}

const Link = makeLink(ReactRouterLink, "ui--link", "Link");
const NavLink = makeLink(ReactRouterNavLink, "ui--nav-link", "NavLink");

interface LinkProps extends ReactRouterLinkProps {}
interface NavLinkProps extends ReactRouterNavLinkProps {}

export type { LinkProps, NavLinkProps };
export { Link, NavLink };
