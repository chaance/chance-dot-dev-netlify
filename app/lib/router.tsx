import { useContext } from "react";
import { UNSAFE_RouteContext } from "react-router-dom";

export function useRouteContext() {
	return useContext(UNSAFE_RouteContext);
}
