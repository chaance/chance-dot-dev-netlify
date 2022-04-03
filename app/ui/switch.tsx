import * as React from "react";
// import { useFocusRing } from "@react-aria/focus";
// import { useFocusWithin } from "@react-aria/interactions";
import cx from "clsx";
import { isFunction } from "~/lib/utils";
// import { useRect } from "~/lib/react";

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

const SwitchRoot = React.forwardRef<HTMLDivElement, SwitchRootProps>(
	(
		{
			children,
			checked: checkedProp,
			className,
			defaultChecked,
			onToggle,
			disabled,
			readOnly,
			required,
			...props
		},
		forwardedRef
	) => {
		let initiallyControlledRef = React.useRef(checkedProp != null);
		let isControlled = checkedProp != null;
		let touchTargetRef = React.useRef<HTMLDivElement | null>(null);

		let [checked, setChecked] = useControllableState({
			componentName: "Switch",
			controlledProp: checkedProp,
			uncontrolledProp: defaultChecked,
			defaultProp: false,
			onChange: onToggle,
		});

		React.useEffect(() => {
			if (initiallyControlledRef.current !== isControlled) {
				console.error(
					"Switch switched from " + initiallyControlledRef.current
						? "controlled to uncontrolled."
						: "uncontrolled to controlled."
				);
			}
		}, [isControlled]);

		if ((disabled || readOnly) && isControlled && !onToggle) {
			console.error(
				"Switch is controlled but missing the onChecked handler. If the field is readOnly or disabled, make sure to set the appropriate prop to true."
			);
		}

		const state = checked ? "on" : "off";

		let ctx: SwitchContextValue = React.useMemo(() => {
			return {
				checked,
				disabled,
				readOnly,
				required,
				setChecked,
				state,
				touchTargetRef,
			};
		}, [checked, disabled, readOnly, required, setChecked, state]);

		return (
			<div
				ref={forwardedRef}
				data-ui-switch-root=""
				data-state={state}
				data-disabled={disabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				data-required={required ? "" : undefined}
				className={cx(
					className,
					"w-8 h-4 relative focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[color:var(--color-focus-ring)] bg-[color:var(--color-body-text-300)] rounded-full"
				)}
				{...props}
				style={{
					position: "relative",
					...props.style,
				}}
			>
				<SwitchContext.Provider value={ctx}>{children}</SwitchContext.Provider>
			</div>
		);
	}
);
SwitchRoot.displayName = "SwitchRoot";

const SwitchInput = React.forwardRef<HTMLInputElement, SwitchInputProps>(
	({ children, onChange, className, ...props }, forwardedRef) => {
		let { setChecked, checked, state, readOnly, required, disabled } =
			useSwitchContext();
		let handleChange = React.useCallback(
			(event: React.ChangeEvent<HTMLInputElement>) => {
				onChange && onChange(event);
				if (!event.defaultPrevented) {
					setChecked(event.target.checked);
				}
			},
			[onChange, setChecked]
		);

		return (
			<input
				ref={forwardedRef}
				role="switch"
				data-ui-switch-input=""
				data-state={state}
				{...props}
				checked={checked}
				onChange={handleChange}
				readOnly={readOnly}
				disabled={disabled}
				required={required}
				type="checkbox"
				className={cx(className, "focus:outline-none")}
				style={{
					...props.style,
					appearance: "none",
					WebkitAppearance: "none",
					MozAppearance: "none",
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					opacity: 0,
					margin: 0,
				}}
			/>
		);
	}
);
SwitchInput.displayName = "SwitchInput";

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
		{ "aria-hidden": ariaHidden, children, onChange, onToggle, ...props },
		forwardedRef
	) => {
		let [rootProps, inputProps] = Object.keys(props).reduce<
			[SwitchRootProps, SwitchInputProps]
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
				onToggle={onToggle}
				ref={forwardedRef}
				{...rootProps}
			>
				<SwitchTouchTarget>
					<SwitchInput onChange={onChange} {...inputProps} />
				</SwitchTouchTarget>
				<SwitchThumb />
				{children}
			</SwitchRoot>
		);
	}
);

Switch.displayName = "Switch";

interface SwitchProps
	extends SwitchRootOwnProps,
		Omit<
			React.ComponentPropsWithRef<"div">,
			keyof SwitchRootOwnProps | SwitchPropsFromInput
		>,
		Pick<SwitchInputProps, SwitchPropsFromInput> {}

interface SwitchRootOwnProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onToggle?: Setter<boolean> | undefined;
	readOnly?: boolean;
	disabled?: boolean;
	required?: boolean;
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
			| "readOnly"
			| "type"
		> {}

const SwitchThumb = React.forwardRef<HTMLDivElement, SwitchThumbProps>(
	({ children, className, ...props }, forwardedRef) => {
		let { checked, state, disabled, readOnly, required } = useSwitchContext();
		return (
			<div
				ref={forwardedRef}
				data-state={state}
				data-disabled={disabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				data-required={required ? "" : undefined}
				className={cx(
					className,
					"absolute left-0 w-4 h-4 transition-transform duration-200 ease-in-out bg-amber-600 rounded-full",
					{
						"translate-x-0": !checked,
						"translate-x-4": checked,
					}
				)}
				{...props}
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
	| "onChange"
	| "form"
	| "id"
	| "name"
	| "value";

export type {
	SwitchProps,
	SwitchRootProps,
	SwitchInputProps,
	SwitchTouchTargetProps,
	SwitchThumbProps,
};
export {
	Switch,
	SwitchRoot,
	SwitchInput,
	SwitchTouchTarget,
	SwitchThumb,
	useSwitchContext,
};

interface SwitchContextValue {
	checked: boolean;
	setChecked: React.Dispatch<React.SetStateAction<boolean>>;
	disabled: boolean | undefined;
	readOnly: boolean | undefined;
	required: boolean | undefined;
	state: "on" | "off";
	touchTargetRef: React.MutableRefObject<HTMLDivElement | null>;
}

function useControllableState<T>({
	controlledProp,
	uncontrolledProp,
	defaultProp,
	onChange,
	componentName,
}: {
	controlledProp: T | undefined;
	uncontrolledProp: T | undefined;
	defaultProp: T;
	onChange: Setter<T> | undefined;
	componentName: string;
}) {
	let isControlled = controlledProp !== undefined;
	let initiallyControlledRef = React.useRef(isControlled);

	let [value, _setValue] = React.useState<T>(
		isControlled ? controlledProp! : uncontrolledProp || defaultProp
	);

	let handleValueChange = React.useCallback(
		(prevValue: T, nextValue: React.SetStateAction<T>) => {
			let value = isFunction(nextValue) ? nextValue(prevValue) : nextValue;
			if (value !== prevValue && onChange) {
				onChange(nextValue);
			}
			return value;
		},
		[onChange]
	);

	let setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
		(nextValue) => {
			if (isControlled) {
				handleValueChange(controlledProp!, nextValue);
			} else {
				_setValue((prevValue) => {
					return handleValueChange(prevValue, nextValue);
				});
			}
		},
		[controlledProp, handleValueChange, isControlled]
	);

	React.useEffect(() => {
		if (initiallyControlledRef.current !== isControlled) {
			console.error(
				`${componentName}: Switched from ${
					initiallyControlledRef.current
						? "controlled to uncontrolled."
						: "uncontrolled to controlled."
				}. Pick a strategy and stick with it for the lifetime of the component.`
			);
		}
	}, [isControlled, componentName]);

	return [isControlled ? controlledProp! : value, setValue] as const;
}

type Setter<State> = (value: State | ((prevState: State) => State)) => void;
