import * as React from "react";

const LevelContext: React.Context<HeadingLevel> = React.createContext(
	1 as HeadingLevel
);

export function useHeadingLevelContext() {
	return React.useContext(LevelContext);
}

export const HeadingLevelProvider: React.FC = ({ children }) => {
	const level = useHeadingLevelContext();
	const ctx = Math.min(level + 1, 6) as HeadingLevel;
	return <LevelContext.Provider value={ctx}>{children}</LevelContext.Provider>;
};

function makeHeading(
	which: "heading" | "ht" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
) {
	const H = React.forwardRef<HTMLHeadingElement, HeadingProps>(
		({ element, ...props }, ref) => {
			let level = useHeadingLevelContext();
			let Comp = element || (`h${level}` as "h1");

			return <Comp {...props} ref={ref} data-level={level} />;
		}
	);
	H.displayName = which == "heading" ? "Heading" : which.toUpperCase();
	return H;
}

interface HeadingOwnProps {
	element?: `h${HeadingLevel}`;
}

interface HeadingProps
	extends HeadingOwnProps,
		Omit<React.ComponentPropsWithRef<"h2">, keyof HeadingOwnProps> {}

export const Heading = makeHeading("heading");
export const H1 = makeHeading("h1");
export const HT = makeHeading("ht");
export const H2 = makeHeading("h2");
export const H3 = makeHeading("h3");
export const H4 = makeHeading("h4");
export const H5 = makeHeading("h5");
export const H6 = makeHeading("h6");

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
