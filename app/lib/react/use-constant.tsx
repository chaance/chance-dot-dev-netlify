import { useRef } from "react";

export function useConstant<V>(fn: () => V): V {
	let ref = useRef<{ v: V }>(null!);
	if (ref.current == null) {
		ref.current = { v: fn() };
	}
	return ref.current.v;
}
