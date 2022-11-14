import cx from "clsx";
import * as React from "react";

const ROOT_CLASS = "ui--container";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	(
		{ children, centered = true, className, purpose = "content", ...props },
		forwardedRef
	) => {
		return (
			<div
				data-ui-id="container"
				ref={forwardedRef}
				className={cx(ROOT_CLASS, `${ROOT_CLASS}--purpose-${purpose}`, {
					[`${ROOT_CLASS}--centered`]: centered,
				})}
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
	purpose?: "content" | "header" | "footer";
}

export type { ContainerProps };
export { Container };
