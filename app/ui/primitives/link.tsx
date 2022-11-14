/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from "react";
import {
	Link as ReactRouterLink,
	NavLink as ReactRouterNavLink,
} from "@remix-run/react";
import type {
	LinkProps as ReactRouterLinkProps,
	NavLinkProps as ReactRouterNavLinkProps,
} from "@remix-run/react";
import { isAbsoluteUrl, isFunction, isString } from "~/lib/utils";

function makeLink(
	Component: typeof ReactRouterLink | typeof ReactRouterNavLink,
	displayName: string
) {
	type P = typeof Component extends typeof ReactRouterNavLink
		? NavLinkProps
		: LinkProps;

	const Link = React.forwardRef<HTMLAnchorElement, P>((props, ref) => {
		if (isString(props.to) && isAbsoluteUrl(props.to)) {
			let { caseSensitive, className, end, style, ...domProps } =
				props as NavLinkProps;
			style = isFunction(style) ? style({ isActive: false }) : style;
			className = isFunction(className)
				? className({ isActive: false })
				: className;
			return (
				<a
					{...domProps}
					data-type="absolute"
					className={className}
					style={style}
					ref={ref}
					href={props.to}
				/>
			);
		}

		// @ts-ignore
		return (
			<Component {...props} data-type={displayName.toLowerCase()} ref={ref} />
		);
	});
	Link.displayName = displayName;
	return Link;
}

const Link = makeLink(ReactRouterLink, "Link");
const NavLink = makeLink(ReactRouterNavLink, "NavLink");

interface LinkProps extends ReactRouterLinkProps {}
interface NavLinkProps extends ReactRouterNavLinkProps {}

export type { LinkProps, NavLinkProps };
export { Link, NavLink };
