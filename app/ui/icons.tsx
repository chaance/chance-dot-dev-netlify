import * as React from "react";

export const SVG = React.forwardRef<SVGSVGElement, SVGProps>(
	(
		{
			children,
			title,
			titleId: titleIdProp,
			"aria-hidden": ariaHidden,
			...props
		},
		ref
	) => {
		let titleId = titleIdProp; /* || `svg-${_titleId}`; */

		ariaHidden = ariaHidden === true || ariaHidden === "true";

		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				{...(ariaHidden
					? { "aria-hidden": true }
					: {
							"aria-labelledby": titleId,
							role: "img",
					  })}
				ref={ref}
				{...props}
			>
				{title ? <title id={titleId}>{title}</title> : null}
				{children}
			</svg>
		);
	}
);
SVG.displayName = "SVG";

type SVGDOMProps = React.ComponentPropsWithRef<"svg">;
type SVGOwnProps = {
	title?: string | null;
	titleId?: string;
};
type SVGProps = SVGDOMProps & SVGOwnProps;

export const TwitterIcon = makeIconComponent(
	{
		size: 20,
		title: "Twitter",
		viewBox: "0 0 17 17",
		displayName: "TwitterIcon",
	},
	<path d="M16.5,1.83a6.89,6.89,0,0,1-2.18.88,3.43,3.43,0,0,0-2.55-1.12A3.49,3.49,0,0,0,8.28,5.06h0a5.31,5.31,0,0,0,.07.81A9.89,9.89,0,0,1,1.18,2.21,3.88,3.88,0,0,0,.68,4,3.62,3.62,0,0,0,2.24,6.87,3.26,3.26,0,0,1,.69,6.43v.06a3.51,3.51,0,0,0,2.8,3.42,4.94,4.94,0,0,1-.94.12l-.62,0a3.47,3.47,0,0,0,3.24,2.43A7.32,7.32,0,0,1,.81,13.89L0,13.84A10,10,0,0,0,5.36,15.4a9.83,9.83,0,0,0,9.9-9.77V5A6.48,6.48,0,0,0,17,3.19a6.35,6.35,0,0,1-2,.56,3.27,3.27,0,0,0,1.5-1.93" />
);

export const GitHubIcon = makeIconComponent(
	{
		size: 20,
		title: "GitHub",
		viewBox: "0 0 17 17",
		displayName: "GitHubIcon",
	},
	<path d="M8.5.7A8,8,0,0,0,6,16.29c.4.07.55-.17.55-.38s0-.82,0-1.49c-2,.37-2.53-.49-2.69-.94A2.91,2.91,0,0,0,3,12.35c-.28-.15-.68-.52,0-.53a1.6,1.6,0,0,1,1.23.82,1.71,1.71,0,0,0,2.33.66,1.68,1.68,0,0,1,.51-1.07c-1.78-.2-3.64-.89-3.64-4a3.11,3.11,0,0,1,.82-2.15A2.87,2.87,0,0,1,4.32,4s.67-.21,2.2.82a7.54,7.54,0,0,1,4,0c1.53-1,2.2-.82,2.2-.82a2.87,2.87,0,0,1,.08,2.12,3.1,3.1,0,0,1,.82,2.15c0,3.07-1.87,3.75-3.65,4a1.89,1.89,0,0,1,.54,1.48c0,1.07,0,1.93,0,2.2s.15.46.55.38A8,8,0,0,0,8.5.7Z" />
);

export const LinkedInIcon = makeIconComponent(
	{
		size: 20,
		title: "LinkedIn",
		viewBox: "0 0 310 310",
		displayName: "LinkedInIcon",
	},
	<path d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z" />
);

export const MoonIcon = makeIconComponent(
	{
		size: 20,
		title: "Moon",
		displayName: "MoonIcon",
		viewBox: "0 0 100 100",
	},
	<path d="M50,0c-1.0191,0-2.0284.04-3.0323.1A44.1321,44.1321,0,1,1,.1,46.9677C.04,47.9717,0,48.981,0,50A50,50,0,1,0,50,0Z" />
);

export const CloseIcon = makeIconComponent(
	{
		size: 20,
		title: "Close",
		displayName: "CloseIcon",
		viewBox: "0 0 20 20",
	},
	<path
		fillRule="evenodd"
		d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
		clipRule="evenodd"
	/>
);

export const GearIcon = makeIconComponent(
	{
		size: 20,
		title: "Gear",
		displayName: "GearIcon",
		viewBox: "0 0 20 20",
	},

	<path
		fillRule="evenodd"
		d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
		clipRule="evenodd"
	/>
);

export const CheckIcon = makeIconComponent(
	{
		size: 20,
		title: "Check",
		displayName: "CheckIcon",
		viewBox: "0 0 20 20",
	},
	<path
		fillRule="evenodd"
		d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
		clipRule="evenodd"
	/>
);

export const GlobeIcon = makeIconComponent(
	{
		size: 24,
		title: "Globe",
		displayName: "GlobeIcon",
		viewBox: "0 0 24 24",
		strokeWidth: 2,
		stroke: "currentColor",
		fill: "none",
	},

	<path
		strokeLinecap="round"
		strokeLinejoin="round"
		d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
	/>
);

export const BriefcaseIcon = makeIconComponent(
	{
		size: 24,
		title: "Briefcase",
		displayName: "BriefcaseIcon",
		viewBox: "0 0 24 24",
		strokeWidth: 2,
		stroke: "currentColor",
		fill: "none",
	},
	<path
		strokeLinecap="round"
		strokeLinejoin="round"
		d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
	/>
);

export function makeIconComponent(
	{
		size,
		title,
		viewBox,
		displayName,
		fill = "currentColor",
		...otherProps
	}: {
		size: number;
		title: string;
		viewBox: string;
		displayName: string;
	} & React.ComponentPropsWithoutRef<"svg">,
	children: React.ReactElement
) {
	const Comp = React.forwardRef<SVGSVGElement, SVGProps>(
		({ title: titleProp, ...props }, ref) => {
			return (
				<SVG
					ref={ref}
					width={size}
					height={size}
					viewBox={viewBox}
					title={titleProp === null ? undefined : titleProp || title}
					fill={fill}
					{...otherProps}
					{...props}
				>
					{children}
				</SVG>
			);
		}
	);
	Comp.displayName = displayName;
	return Comp;
}
