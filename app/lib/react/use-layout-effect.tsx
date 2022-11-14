import { useLayoutEffect as useReactLayoutEffect } from "react";
import { canUseDOM } from "~/lib/utils";

export const useLayoutEffect = canUseDOM ? useReactLayoutEffect : () => {};
