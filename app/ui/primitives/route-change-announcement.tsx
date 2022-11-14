import * as React from "react";
import { useLocation, useTransition } from "@remix-run/react";
import { useRootContext } from "~/lib/context";

type Location = ReturnType<typeof useLocation>;
type Transition = ReturnType<typeof useTransition>;

enum NavigationState {
	Idle = 0,
	Navigating = 1,
}

function getPageTitle(location: Location) {
	return location.pathname === "/" ? "Home page" : document.title;
}

function getNavigatingState(
	location: Location,
	transition: Transition
): NavigationState {
	return transition.state === "loading" &&
		transition.location.pathname === location.pathname
		? NavigationState.Navigating
		: NavigationState.Idle;
}

/**
 * Provides an alert for screen reader users when the route changes.
 */
const RouteChangeAnnouncement = React.memo(function RouteChangeAnnouncement() {
	let { hydrated } = useRootContext();
	let [innerHtml, setInnerHtml] = React.useState("");
	let location = useLocation();
	let transition = useTransition();

	let locationHasChanged = React.useRef(false);
	React.useEffect(() => {
		// We know navigation has changed since the initial page load the first time
		// our transition state is loading
		if (transition.state === "loading") {
			locationHasChanged.current = true;
		}

		// If nothing has changed yet, no announcements needed.
		if (!locationHasChanged.current) {
			return;
		}

		setInnerHtml(
			getNavigatingState(location, transition) === NavigationState.Navigating
				? `Navigating` // ?? `Navigating to ${getPageTitle(transition.location!)}`
				: `Navigated to ${getPageTitle(location)}`
		);
	}, [location, transition]);

	// Render nothing on the server. Transitions before hydration will be handled
	// by the browser.
	if (!hydrated) {
		return null;
	}

	return (
		<div
			className="sr-only"
			aria-live="assertive"
			aria-atomic
			aria-busy={
				getNavigatingState(location, transition) === NavigationState.Navigating
					? true
					: undefined
			}
			id="route-change-region"
		>
			{innerHtml}
		</div>
	);
});

export { RouteChangeAnnouncement };
