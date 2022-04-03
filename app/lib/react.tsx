import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect as useReactLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import { canUseDOM } from "~/lib/utils";

export const useLayoutEffect = canUseDOM ? useReactLayoutEffect : () => {};

enum PromiseStates {
	Loading = 0,
	Resolved = 1,
	Error = 2,
}

export function usePromise<ResolvedType = any, ErrorType = any>(
	getPromise: () => Promise<ResolvedType>,
	opts?: { effectHook?: typeof useEffect }
): [
	PromiseState<ResolvedType, ErrorType>["value"],
	ResolvedType | null,
	ErrorType | null
] {
	let { effectHook = useEffect } = opts || {};
	let [state, dispatch] = useReducer(
		(
			state: PromiseState<ResolvedType, ErrorType>,
			action: PromiseActions<ResolvedType, ErrorType>
		): PromiseState<ResolvedType, ErrorType> => {
			switch (action.type) {
				case PromiseStates.Loading:
					return { ...state, value: "loading" };
				case PromiseStates.Resolved:
					return {
						value: "resolved",
						response: action.response,
						error: null,
					};
				case PromiseStates.Error:
					return {
						value: "error",
						response: null,
						error: action.error,
					};
				default:
					return state;
			}
		},
		{
			value: "loading",
			response: null,
			error: null,
		}
	);

	effectHook(() => {
		let isCurrent = true;
		dispatch({ type: PromiseStates.Loading });
		getPromise()
			.then((response) => {
				if (!isCurrent) return;
				dispatch({ type: PromiseStates.Resolved, response });
			})
			.catch((error: ErrorType) => {
				dispatch({ type: PromiseStates.Error, error });
			});
		return () => {
			isCurrent = false;
		};
	}, [getPromise]);

	return [state.value, state.response, state.error];
}

interface PromiseState<ResolvedType, ErrorType> {
	value: "loading" | "resolved" | "error";
	response: null | ResolvedType;
	error: null | ErrorType;
}

type PromiseActions<ResolvedType, ErrorType> =
	| { type: PromiseStates.Loading }
	| { type: PromiseStates.Resolved; response: ResolvedType }
	| { type: PromiseStates.Error; error: ErrorType };

export function useConsole(message: any, method: "log" | "warn" | "error") {
	if (!canUseDOM) {
		console[method](message);
	}

	useEffect(() => {
		console[method](message);
	}, [message, method]);
}

export function useConsoleLog(message: any) {
	return useConsole(message, "log");
}

export function useConsoleWarn(message: any) {
	return useConsole(message, "warn");
}

export function useConsoleError(message: any) {
	return useConsole(message, "error");
}

let idsUpdaterMap: Map<string, (v: string) => void> = new Map();

interface IdContextValue {
	prefix: string;
	current: number;
}

const defaultIdContext: IdContextValue = {
	prefix: String(Math.round(Math.random() * 100000000)),
	current: 0,
};

const IdContext = createContext<IdContextValue>(defaultIdContext);

export function IdProvider(props: React.PropsWithChildren<{}>): JSX.Element {
	let cur = useContext(IdContext);
	let value: IdContextValue = useMemo(
		() => ({
			prefix: cur === defaultIdContext ? "" : `${cur.prefix}-${++cur.current}`,
			current: 0,
		}),
		[cur]
	);

	return (
		<IdContext.Provider value={value}>{props.children}</IdContext.Provider>
	);
}

export function useSafeId(defaultId?: string | undefined | null): string {
	let ctx = useContext(IdContext);

	if (ctx === defaultIdContext && !canUseDOM) {
		console.warn("You forgot the ID provider!");
	}

	return useMemo(
		() => defaultId || `${ctx.prefix}-${++ctx.current}`,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[defaultId]
	);
}

export function useId(defaultId?: string): string {
	let isRendering = useRef(true);
	isRendering.current = true;
	let [value, setValue] = useState<string | null | undefined>(defaultId);
	let nextId = useRef<string | null>(null);
	let res = useSafeId(value);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	let updateValue = (val: string) => {
		if (!isRendering.current) {
			setValue(val);
		} else {
			nextId.current = val;
		}
	};

	idsUpdaterMap.set(res, updateValue);

	useLayoutEffect(() => {
		isRendering.current = false;
	}, [updateValue]);

	useLayoutEffect(() => {
		let r = res;
		return () => {
			idsUpdaterMap.delete(r);
		};
	}, [res]);

	useEffect(() => {
		let newId = nextId.current;
		if (newId) {
			setValue(newId);
			nextId.current = null;
		}
	}, [setValue, updateValue]);
	return res;
}

/**
 * Merges two ids.
 * Different ids will trigger a side-effect and re-render components hooked up with `useId`.
 */
export function mergeIds(idA: string, idB: string): string {
	if (idA === idB) {
		return idA;
	}

	let setIdA = idsUpdaterMap.get(idA);
	if (setIdA) {
		setIdA(idB);
		return idB;
	}

	let setIdB = idsUpdaterMap.get(idB);
	if (setIdB) {
		setIdB(idA);
		return idA;
	}

	return idB;
}

export function useSlotId(depArray: ReadonlyArray<any> = []): string {
	let id = useId();
	let [resolvedId, setResolvedId] = useValueEffect(id);
	let updateId = useCallback(() => {
		setResolvedId(function* () {
			yield id;

			yield document.getElementById(id) ? id : null;
		});
	}, [id, setResolvedId]);

	useLayoutEffect(updateId, [id, updateId, ...depArray]);

	return resolvedId;
}

type SetValueAction<S> = (prev: S) => Generator<any, void, unknown>;

// This hook works like `useState`, but when setting the value, you pass a generator function
// that can yield multiple values. Each yielded value updates the state and waits for the next
// layout effect, then continues the generator. This allows sequential updates to state to be
// written linearly.
export function useValueEffect<S>(
	defaultValue: S | (() => S)
): [S, React.Dispatch<SetValueAction<S>>] {
	let [value, setValue] = useState(defaultValue);
	let valueRef = useRef(value);
	let effect = useRef<Generator<S> | null>(null);

	valueRef.current = value;

	// Store the function in a ref so we can always access the current version
	// which has the proper `value` in scope.
	let nextRef = useRef<() => void>(null!);
	nextRef.current = () => {
		if (!effect.current) {
			return;
		}

		// Run the generator to the next yield.
		let newValue = effect.current.next();

		// If the generator is done, reset the effect.
		if (newValue.done) {
			effect.current = null;
			return;
		}

		// If the value is the same as the current value,
		// then continue to the next yield. Otherwise,
		// set the value in state and wait for the next layout effect.
		if (value === newValue.value) {
			nextRef.current();
		} else {
			setValue(newValue.value);
		}
	};

	useLayoutEffect(() => {
		// If there is an effect currently running, continue to the next yield.
		if (effect.current) {
			nextRef.current();
		}
	});

	let queue: React.Dispatch<SetValueAction<S>> = useCallback(
		(fn) => {
			effect.current = fn(valueRef.current);
			nextRef.current();
		},
		[effect, nextRef]
	);

	return [value, queue];
}

export function useRect(
	elementRef: React.RefObject<HTMLElement | SVGElement | null | undefined>
) {
	let [size, setSize] = useState<
		Record<"inlineSize" | "blockSize", number | undefined>
	>({ inlineSize: undefined, blockSize: undefined });

	useEffect(() => {
		let element = elementRef.current!;
		if (!element) return;

		// TODO: fallback
		if (!("ResizeObserver" in window)) return;

		let resizeObserver = new ResizeObserver((entries) => {
			if (!Array.isArray(entries)) return;
			if (!entries.length) return;

			let entry = entries[0];
			let inlineSize: number;
			let blockSize: number;

			if ("borderBoxSize" in entry) {
				let borderSizeEntry = entry["borderBoxSize"];
				let borderSize: ResizeObserverSize = Array.isArray(borderSizeEntry)
					? borderSizeEntry[0]
					: borderSizeEntry;
				inlineSize = borderSize.inlineSize;
				blockSize = borderSize.blockSize;
			} else {
				let rect = element.getBoundingClientRect();
				inlineSize = rect.width;
				blockSize = rect.height;
			}

			setSize({ inlineSize, blockSize });
		});

		resizeObserver.observe(element, { box: "border-box" });

		return () => {
			setSize({ inlineSize: undefined, blockSize: undefined });
			element && resizeObserver.unobserve(element);
		};
	}, [elementRef]);

	return size;
}
