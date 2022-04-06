import * as React from "react";
import cx from "clsx";
import mitt from "mitt";
import type { Emitter } from "mitt";
import { useConstant } from "~/lib/react";
import { CheckIcon } from "~/ui/icons";
import { isFunction } from "~/lib/utils";

const SwitchContext = React.createContext<SwitchContextValue | null>(null);
function useSwitchContext(): SwitchContextValue {
	let ctx = React.useContext(SwitchContext);
	if (!ctx) {
		throw Error(
			"Switch components were used outside of a SwitchRoot component"
		);
	}
	return ctx;
}
SwitchContext.displayName = "SwitchContext";

type SwitchEvents = {
	checked: boolean;
};

const SwitchRoot = React.forwardRef<HTMLDivElement, SwitchRootProps>(
	(
		{
			children,
			checked: checkedProp,
			className,
			defaultChecked,
			onChange,
			disabled,
			readOnly,
			required,
			...props
		},
		forwardedRef
	) => {
		let isControlled = checkedProp !== undefined;
		let emitter = useConstant(() => mitt<SwitchEvents>());
		let touchTargetRef = React.useRef<HTMLDivElement | null>(null);
		let [checked, setChecked] = React.useState(
			checkedProp ?? defaultChecked ?? false
		);
		React.useEffect(() => {
			emitter.on("checked", (checked) => {
				if (!isControlled) {
					setChecked(checked);
				}
			});
			return () => {
				emitter.off("checked");
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isControlled]);

		React.useEffect(() => {
			if (isControlled) {
				setChecked(checkedProp!);
			}
		}, [isControlled, checkedProp]);

		let ctx: SwitchContextValue = {
			checked,
			disabled,
			emitter,
			onChange,
			readOnly,
			required,
			touchTargetRef,
		};

		return (
			<div
				ref={forwardedRef}
				data-ui-switch-root=""
				data-state={checked ? "on" : "off"}
				data-disabled={disabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				data-required={required ? "" : undefined}
				className={cx(
					className,
					"inline-block relative w-[var(--ui-switch-width)] h-[var(--ui-switch-height)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[color:var(--color-focus-ring)] rounded-full"
				)}
				{...props}
				style={{
					...props.style,
					// @ts-expect-error
					"--ui-switch-width": "34px",
					"--ui-switch-height": "20px",
					"--ui-switch-gap": "2px",
				}}
			>
				<SwitchContext.Provider value={ctx}>
					{isFunction(children) ? children({ checked }) : children}
				</SwitchContext.Provider>
			</div>
		);
	}
);
SwitchRoot.displayName = "SwitchRoot";

const SwitchInput = React.forwardRef<HTMLInputElement, SwitchInputProps>(
	({ children, className, ...props }, forwardedRef) => {
		let { emitter, checked, onChange, readOnly, required, disabled } =
			useSwitchContext();
		let handleChange = React.useCallback(
			(event: React.ChangeEvent<HTMLInputElement>) => {
				onChange && onChange(event);
				if (!event.defaultPrevented) {
					emitter.emit("checked", event.target.checked);
				}
			},
			[onChange, emitter]
		);

		return (
			<input
				ref={forwardedRef}
				role="switch"
				data-ui-switch-input=""
				data-state={checked ? "on" : "off"}
				{...props}
				checked={checked}
				onChange={handleChange}
				readOnly={readOnly}
				disabled={disabled}
				required={required}
				type="checkbox"
				className={cx(
					"ui--switch__input",
					className,
					"appearance-none absolute top-0 left-0 bottom-0 right-0 opacity-0 m-0 p-0 z-10 cursor-pointer focus:outline-none"
				)}
			/>
		);
	}
);
SwitchInput.displayName = "SwitchInput";

const SwitchNest = React.forwardRef<HTMLDivElement, SwitchTouchTargetProps>(
	({ className, ...props }, forwardedRef) => {
		let { checked } = useSwitchContext();
		return (
			<div
				ref={forwardedRef}
				data-ui-switch-nest=""
				data-state={checked ? "on" : "off"}
				className={cx(
					className,
					"ui--switch__nest",
					"block relative w-[var(--ui-switch-width)] h-[var(--ui-switch-height)] rounded-full pointer-events-none bg-current",
					{
						"ui--switch__nest--checked": checked,
						"text-blue-600 dark:text-blue-400": checked,
						"text-gray-700 dark:text-gray-200": !checked,
					}
				)}
				{...props}
			/>
		);
	}
);
SwitchNest.displayName = "SwitchNest";

interface SwitchNestProps extends React.ComponentPropsWithRef<"div"> {}

const SwitchTouchTarget = React.forwardRef<
	HTMLDivElement,
	SwitchTouchTargetProps
>((props, forwardedRef) => {
	return (
		<div
			ref={forwardedRef}
			data-ui-switch-touch-target=""
			{...props}
			style={{
				position: "absolute",
				minWidth: "100%",
				minHeight: "100%",
				opacity: 0,
				zIndex: 1,
				...props.style,
			}}
		/>
	);
});
SwitchTouchTarget.displayName = "SwitchTouchTarget";

interface SwitchTouchTargetProps extends React.ComponentPropsWithRef<"div"> {}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
	(
		{ "aria-hidden": ariaHidden, children, onChange, ...props },
		forwardedRef
	) => {
		let [rootProps, inputProps] = Object.keys(props).reduce<
			[Omit<SwitchRootProps, "children">, SwitchInputProps]
		>(
			(prev, propName) => {
				let propValue = props[propName as keyof typeof props];
				if (
					propName.startsWith("aria-") ||
					[
						"autoComplete",
						"autoCorrect",
						"autoFocus",
						"autoSave",
						"form",
						"id",
						"name",
						"value",
					].includes(propName)
				) {
					return [
						prev[0],
						{
							...prev[1],
							[propName]: propValue,
						},
					];
				}
				return [
					{
						...prev[0],
						[propName]: propValue,
					},
					prev[1],
				];
			},
			[{}, {}]
		);

		return (
			<SwitchRoot
				aria-hidden={ariaHidden}
				onChange={onChange}
				ref={forwardedRef}
				{...rootProps}
			>
				{({ checked }) => (
					<React.Fragment>
						{/* <SwitchTouchTarget>
							<SwitchInput {...inputProps} />
						</SwitchTouchTarget> */}
						<SwitchInput {...inputProps} />
						<SwitchNest>
							<SwitchThumb className="flex items-center justify-center">
								<CheckIcon
									className={cx(
										"h-[calc(var(--ui-switch-toggle-size)*0.8)] w-[calc(var(--ui-switch-toggle-size)*0.8)] transition-opacity duration-300 ease-in-out",
										{
											"opacity-0": !checked,
											"opacity-100": checked,
										}
									)}
								/>
							</SwitchThumb>
						</SwitchNest>
						{children}
					</React.Fragment>
				)}
			</SwitchRoot>
		);
	}
);

Switch.displayName = "Switch";

interface SwitchProps
	extends Omit<SwitchRootOwnProps, "children">,
		Omit<
			React.ComponentPropsWithRef<"div">,
			keyof SwitchRootOwnProps | SwitchPropsFromInput
		>,
		Pick<SwitchInputProps, SwitchPropsFromInput> {}

interface SwitchRootOwnProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
	readOnly?: boolean;
	disabled?: boolean;
	required?: boolean;
	children:
		| React.ReactNode
		| ((props: { checked: boolean }) => React.ReactNode);
}

interface SwitchRootProps
	extends SwitchRootOwnProps,
		Omit<React.ComponentPropsWithRef<"div">, keyof SwitchRootOwnProps> {}

interface SwitchInputOwnProps {}
interface SwitchInputProps
	extends SwitchInputOwnProps,
		Omit<
			React.ComponentPropsWithRef<"input">,
			| keyof SwitchInputOwnProps
			| "aria-checked"
			| "checked"
			| "children"
			| "defaultChecked"
			| "disabled"
			| "onChange"
			| "readOnly"
			| "type"
		> {}

const SwitchThumb = React.forwardRef<HTMLDivElement, SwitchThumbProps>(
	({ children, className, ...props }, forwardedRef) => {
		let { checked, disabled, readOnly, required } = useSwitchContext();
		return (
			<div
				ref={forwardedRef}
				data-state={checked ? "on" : "off"}
				data-disabled={disabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				data-required={required ? "" : undefined}
				className={cx(
					className,
					"absolute pointer-events-none transition-transform duration-300 ease-in-out rounded-full bg-gray-200 dark:bg-gray-400 h-[var(--ui-switch-toggle-size)] w-[var(--ui-switch-toggle-size)] top-[var(--ui-switch-gap)] left-[var(--ui-switch-gap)]",
					{
						"translate-x-0": !checked,
						"translate-x-[calc(var(--ui-switch-width)-var(--ui-switch-toggle-size)-var(--ui-switch-gap)*2)]":
							checked,
					}
				)}
				{...props}
				style={{
					...props.style,
					// @ts-expect-error
					"--ui-switch-toggle-size": `calc(
						var(--ui-switch-height) - var(--ui-switch-gap) * 2
					)`,
				}}
			>
				{children}
			</div>
		);
	}
);
SwitchThumb.displayName = "SwitchThumb";

interface SwitchThumbOwnProps {}

interface SwitchThumbProps
	extends SwitchThumbOwnProps,
		Omit<React.ComponentPropsWithRef<"div">, keyof SwitchThumbOwnProps> {}

type SwitchPropsFromInput =
	| "aria-label"
	| "aria-labelledby"
	| "autoComplete"
	| "autoCorrect"
	| "autoFocus"
	| "autoSave"
	| "form"
	| "id"
	| "name"
	| "value";

export type {
	SwitchProps,
	SwitchRootProps,
	SwitchInputProps,
	SwitchNestProps,
	SwitchTouchTargetProps,
	SwitchThumbProps,
};
export {
	Switch,
	SwitchRoot,
	SwitchInput,
	SwitchNest,
	SwitchTouchTarget,
	SwitchThumb,
	useSwitchContext,
};

interface SwitchContextValue {
	emitter: Emitter<SwitchEvents>;
	checked: boolean;
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
	disabled: boolean | undefined;
	readOnly: boolean | undefined;
	required: boolean | undefined;
	touchTargetRef: React.MutableRefObject<HTMLDivElement | null>;
}
