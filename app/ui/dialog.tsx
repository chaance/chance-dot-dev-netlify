import * as React from "react";
import cx from "clsx";

const DialogRoot = React.forwardRef<HTMLDivElement, DialogRootProps>(
	({ className, children, role = "dialog", ...props }, forwardedRef) => {
		/* eslint-disable react-hooks/rules-of-hooks */
		if (process.env.NODE_ENV === "development") {
			useEffectOnce(() => {
				console.warn(
					"Only use Dialog on routes that load our vanilla scripts file. Dialog's interactivity is handled outside of React."
				);
			});

			let { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby } =
				props;
			React.useEffect(() => {
				if (ariaLabel == null && ariaLabelledby == null) {
					console.warn(
						'Dialog requires either an "aria-label" or "aria-labelledby" prop.'
					);
				}
			}, [ariaLabel, ariaLabelledby]);
			/* eslint-enable react-hooks/rules-of-hooks */
		}
		return (
			<div
				ref={forwardedRef}
				role={role}
				className={cx(className, "z-20")}
				{...props}
				// required until a11y-dialog opens it
				aria-hidden
				aria-modal
				tabIndex={-1}
				data-a11y-dialog-root
			>
				{children}
			</div>
		);
	}
);

DialogRoot.displayName = "DialogRoot";

interface DialogRootOwnProps {
	id: string;
	role?: "dialog" | "alertdialog";
}
interface DialogRootDomProps
	extends Omit<React.ComponentPropsWithRef<"div">, keyof DialogRootOwnProps> {}
interface DialogRootProps extends DialogRootDomProps, DialogRootOwnProps {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
	({ className, ...props }, forwardedRef) => {
		return (
			<div
				ref={forwardedRef}
				data-a11y-dialog-overlay
				data-a11y-dialog-hide
				className={cx(className, "")}
				{...props}
			/>
		);
	}
);
DialogOverlay.displayName = "DialogOverlay";

interface DialogOverlayOwnProps {}
interface DialogOverlayDomProps
	extends Omit<
		React.ComponentPropsWithRef<"div">,
		keyof DialogOverlayOwnProps
	> {}
interface DialogOverlayProps
	extends DialogOverlayDomProps,
		DialogOverlayOwnProps {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
	({ className, ...props }, forwardedRef) => {
		return (
			<div
				ref={forwardedRef}
				role="document"
				data-a11y-dialog-content
				className={cx(
					className,
					"p-4 pt-7 md:p-8 md:pt-12 bg-gray-50 dark:bg-gray-950 sm:border-[1px] sm:border-gray-400 sm:dark:border-gray-600 sm:rounded-md"
				)}
				{...props}
			/>
		);
	}
);
DialogContent.displayName = "DialogContent";

interface DialogContentOwnProps {}
interface DialogContentDomProps
	extends Omit<
		React.ComponentPropsWithRef<"div">,
		keyof DialogContentOwnProps
	> {}
interface DialogContentProps
	extends DialogContentDomProps,
		DialogContentOwnProps {}

const DialogCloseButton = React.forwardRef<
	HTMLButtonElement,
	DialogCloseButtonProps
>((props, forwardedRef) => {
	return (
		<button ref={forwardedRef} data-a11y-dialog-hide {...props} type="button" />
	);
});
DialogCloseButton.displayName = "DialogCloseButton";

interface DialogCloseButtonOwnProps {}
interface DialogCloseButtonDomProps
	extends Omit<
		React.ComponentPropsWithRef<"button">,
		keyof DialogCloseButtonOwnProps | "type"
	> {}
interface DialogCloseButtonProps
	extends DialogCloseButtonDomProps,
		DialogCloseButtonOwnProps {}

export type {
	DialogRootProps,
	DialogOverlayProps,
	DialogContentProps,
	DialogCloseButtonProps,
};
export { DialogRoot, DialogOverlay, DialogContent };

function useEffectOnce(fn: React.EffectCallback) {
	if (process.env.NODE_ENV === "development") {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		React.useEffect(() => {
			console.warn(
				"useEffectOnce can be unsafe in many circumstances. Do not use it for anything that requires cleanup, or anything that sets state that could be overridden by another effect."
			);
		}, []);
	}

	let done = React.useRef(false);
	React.useEffect(() => {
		if (!done.current) {
			fn();
			done.current = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
