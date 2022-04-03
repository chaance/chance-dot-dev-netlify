/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from "react";
import { Link as ReactRouterLink, NavLink as ReactRouterNavLink } from "remix";
import type {
	LinkProps as ReactRouterLinkProps,
	NavLinkProps as ReactRouterNavLinkProps,
} from "remix";
import { isAbsoluteUrl, isFunction, isString } from "~/lib/utils";
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
					className={cx(className, baseClassName)}
					style={style}
					ref={ref}
					href={props.to}
				/>
			);
		}

		let className = props.className as NavLinkProps["className"];
		if (isFunction(className)) {
			let c = className;
			className = (args: { isActive: boolean }) =>
				cx(c(args), baseClassName, {
					[`${baseClassName}--active`]: args.isActive,
				});
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
