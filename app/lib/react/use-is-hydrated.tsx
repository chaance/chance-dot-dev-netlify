import * as React from "react";

let hydrated = false;

export function useIsHydrated() {
	let [useIsHydrated, setIsHydrated] = React.useState(() => hydrated);
	React.useEffect(() => {
		hydrated = true;
		setIsHydrated(true);
	}, []);
	return useIsHydrated;
}
