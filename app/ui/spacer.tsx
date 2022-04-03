import * as React from "react";
import cx from "clsx";
import { isString } from "~/lib/utils";

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
	({ children, axis = "y", size, className, ...props }, forwardedRef) => {
		let isMinMax = isString(size) && size.startsWith("minmax");
		let min: string = null!,
			max: string = null!;
		if (isMinMax) {
			[min, max] = (size as string)
				.split("minmax(")[1]
				.split(")")[0]
				.split(",")
				.map((value) => value.trim());
		}
		return (
			<div
				ref={forwardedRef}
				className={cx(className, "ui--spacer", `ui--spacer--axis-${axis}`, {
					[`ui--spacer--minmax`]: isMinMax,
					[`ui--spacer--${size}`]: !isMinMax,
					[`ui--spacer--min-${min}`]: !!(isMinMax && min),
					[`ui--spacer--max-${max}`]: !!(isMinMax && max),
				})}
				{...props}
			>
				{children}
			</div>
		);
	}
);

Spacer.displayName = "Spacer";

interface SpacerProps extends React.ComponentPropsWithRef<"div"> {
	axis?: "x" | "y";
	size: SpacerSize | `minmax(${SpacerSize}, ${SpacerSize})`;
}

type SpacerSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type { SpacerProps };
export { Spacer };
