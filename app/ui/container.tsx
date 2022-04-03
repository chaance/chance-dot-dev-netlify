import cx from "clsx";
import * as React from "react";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	({ children, centered = true, className, ...props }, forwardedRef) => {
		return (
			<div
				ref={forwardedRef}
				className={cx(
					className,
					"container px-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl",
					{ "mx-auto": centered }
				)}
				{...props}
			>
				{children}
			</div>
		);
	}
);

Container.displayName = "Container";

interface ContainerProps extends React.ComponentPropsWithRef<"div"> {
	centered?: boolean;
}

export type { ContainerProps };
export { Container };
