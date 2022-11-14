import * as React from "react";

const RootContext = React.createContext<RootContextData>({
	hydrated: false,
});

interface RootContextData {
	hydrated: boolean;
}

export function RootProvider({
	children,
	hydrated,
}: {
	children: React.ReactNode;
	hydrated: boolean;
}) {
	return (
		<RootContext.Provider value={{ hydrated }}>{children}</RootContext.Provider>
	);
}

export function useRootContext() {
	return React.useContext(RootContext);
}
