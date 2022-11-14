import * as React from "react";
import { NavLink } from "@remix-run/react";
import cx from "clsx";
import { Container } from "~/ui/container";
import { isWebKit } from "~/lib/utils";
import { useRootContext } from "~/lib/context";

const ROOT_CLASS = "cs--site-header";

const SiteHeader: React.FC<SiteHeaderProps> = ({
	id,
	includeBottomMargin = true,
	hideLogo,
	position = "default",
}) => {
	let { hydrated } = useRootContext();
	let logoRef = React.useRef<SVGSVGElement | null>(null);
	let logoTextRef = React.useRef<SVGGElement | null>(null);
	let isPastScrollThreshold = useHeaderScrollEffects({
		headerThreshold: 60,
		logoRotationAngle: 3,
		logoRotationRef: logoTextRef,
	});

	return (
		<header
			data-ui-position={position}
			data-ui-is-past-scroll-threshold={isPastScrollThreshold}
			data-ui-hydrated={hydrated || undefined}
			data-ui-has-bottom-margin={includeBottomMargin || undefined}
			id={id as string}
			className={cx(ROOT_CLASS, "w-full", {
				"transition-colors duration-200": hydrated,
				"mb-10 sm:mb-14 md:mb-20": includeBottomMargin,
				relative: position === "default",
				"sticky top-0 z-10": position === "sticky",
				"fixed top-0 z-10": position === "fixed",
				"absolute top-0 z-10": position === "absolute",
				"bg-opacity-0 border-b border-b-transparent border-opacity-0":
					!isPastScrollThreshold,
			})}
		>
			<Container purpose="header">
				<div className={`${ROOT_CLASS}__inner`}>
					<nav aria-label="Main" className={`${ROOT_CLASS}__nav`}>
						<ul className={`${ROOT_CLASS}__nav-list`}>
							<li className={`${ROOT_CLASS}__nav-item`}>
								<NavLink
									className={`${ROOT_CLASS}__nav-link`}
									to="/blog"
									prefetch="intent"
								>
									Articles
								</NavLink>
							</li>
						</ul>
					</nav>
					{hideLogo ? null : (
						<NavLink
							className={`${ROOT_CLASS}__logo-link`}
							to="/"
							aria-label="Chance the Dev"
							prefetch="intent"
						>
							<svg
								className={`${ROOT_CLASS}__logo`}
								ref={logoRef}
								viewBox="0 0 600 600"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g
									ref={logoTextRef}
									data-ui-id="site-header-logo-text"
									className={`${ROOT_CLASS}__logo-text`}
								>
									<path d="M98.0149 338.589C93.9379 317.559 79.1279 304.353 61.8582 304.128L58.6669 324.525C68.1212 325.244 75.6968 332.069 77.628 342.031C80.1075 354.82 71.8867 365.729 57.0063 368.614C42.1259 371.499 30.4242 364.452 27.9446 351.663C26.0135 341.701 30.4897 332.54 38.9903 328.34L28.408 310.613C12.4735 317.275 3.67161 335.059 7.74854 356.088C12.7791 382.037 34.2425 395.995 61.2978 390.75C88.3531 385.505 103.045 364.537 98.0149 338.589Z" />
									<path d="M55.2287 208.18L45.5011 239.263L12.6247 228.974L6.26434 249.298L91.1453 275.861L97.5057 255.538L64.6292 245.249L74.3568 214.166L107.233 224.455L113.594 204.131L28.7127 177.567L22.3523 197.891L55.2287 208.18Z" />
									<path d="M186.527 122.564L102.016 80.7417L84.0772 98.2311L123.741 183.776L139.886 168.036L133.581 155.288L157.799 131.678L170.382 138.304L186.527 122.564ZM109.224 106.08L140.286 122.508L124.859 137.549L109.224 106.08Z" />
									<path d="M251.115 65.3167L206.773 19.4776L182.68 26.3511L207.081 111.879L227.56 106.036L212.129 51.9491L256.471 97.7883L280.563 90.9148L256.162 5.38693L235.684 11.2294L251.115 65.3167Z" />
									<path d="M347.493 100.14C368.413 104.75 386.414 96.4019 393.479 80.6416L376.026 69.6128C371.612 78.0041 362.34 82.2464 352.43 80.063C339.708 77.2596 332.961 65.3828 336.222 50.5804C339.484 35.778 350.598 27.8367 363.32 30.6401C373.229 32.8235 379.86 40.5699 380.339 50.0394L400.811 47.3668C401.024 30.097 388.198 14.9565 367.279 10.3472C341.466 4.6596 320.132 18.815 314.202 45.7285C308.272 72.6419 321.681 94.4527 347.493 100.14Z" />
									<path d="M445.622 105.752L471.784 126.59L483.491 111.892L457.329 91.0543L466.695 79.2961L497.756 104.037L510.243 88.3589L462.525 50.3508L407.112 119.92L455.811 158.709L468.298 143.031L436.257 117.51L445.622 105.752Z" />
									<path d="M596.059 252.072L575.194 181.171L555.966 186.829L563.393 212.065L497.298 231.516L503.31 251.946L569.405 232.495L576.832 257.731L596.059 252.072Z" />
									<path d="M556.346 364.139L562.258 332.11L596.134 338.363L600 317.422L512.537 301.276L508.671 322.218L542.548 328.472L536.636 360.5L502.759 354.247L498.893 375.189L586.356 391.334L590.222 370.392L556.346 364.139Z" />
									<path d="M501.474 439.057L481.547 465.919L496.638 477.114L516.565 450.252L528.638 459.208L504.979 491.101L521.076 503.042L557.423 454.047L485.993 401.056L448.899 451.057L464.996 462.999L489.402 430.1L501.474 439.057Z" />
									<path d="M391.285 584.186L424.011 574.259L398.195 489.148L367.147 498.565C340.655 506.601 328.196 528.969 335.978 554.622C343.686 580.035 365.872 591.894 391.285 584.186ZM383.634 514.509L397.815 561.26L387.505 564.387C373.72 568.569 361.773 561.982 357.555 548.077C353.265 533.932 359.659 521.781 373.444 517.6L383.634 514.509Z" />
									<path d="M270.717 542.583L237.704 537.214L234.688 555.76L267.701 561.129L265.288 575.967L226.093 569.592L222.876 589.375L283.09 599.168L297.367 511.381L235.916 501.387L232.699 521.17L273.13 527.745L270.717 542.583Z" />
									<path d="M168.83 490.242L146.959 555.815L166.564 569.53L193.939 480.137L170.126 463.478L95.5342 519.84L114.831 533.339L168.83 490.242Z" />
								</g>
								<g className={`${ROOT_CLASS}__logo-mark`}>
									<path d="M440 303C419.326 286.333 398.745 269.667 378.259 253C357.961 236.333 337.474 219.667 316.8 203V247.841C328.077 257.101 339.354 266.36 350.631 275.619C362.095 284.614 373.466 293.741 384.743 303C373.466 312.259 362.095 321.518 350.631 330.778C339.354 339.772 328.077 348.899 316.8 358.159V403C337.474 386.333 357.961 369.667 378.259 353C398.745 336.333 419.326 319.667 440 303Z" />
									<path d="M160 303C180.674 319.667 201.255 336.333 221.741 353C242.039 369.667 262.526 386.333 283.2 403V358.159C271.923 348.899 260.646 339.64 249.369 330.381C237.904 321.386 226.534 312.259 215.257 303C226.534 293.741 237.905 284.481 249.369 275.222C260.646 266.228 271.923 257.101 283.2 247.841V203C262.526 219.667 242.039 236.333 221.741 253C201.255 269.667 180.674 286.333 160 303Z" />
								</g>
							</svg>
						</NavLink>
					)}
				</div>
			</Container>
		</header>
	);
};

interface SiteHeaderProps {
	navLinks?: SiteNavLink[];
	id?: string | number;
	includeBottomMargin?: boolean;
	hideLogo?: boolean;
	position?: "sticky" | "fixed" | "absolute" | "default";
}

interface SiteNavLink {
	label: string;
	href: string;
	icon: React.ReactElement;
}

export type { SiteHeaderProps };
export { SiteHeader };

// When the user scrolls, I want a fun lil logo animation—the ring of text
// around the logo mark will rotate. Using state updates to achieve this causes
// a noticeable lag on some browsers, even when scheduled via
// requestAnimationFrame. Updating the DOM directly solves this.
function useHeaderScrollEffects({
	headerThreshold,
	logoRotationAngle,
	logoRotationRef,
}: {
	headerThreshold: number;
	logoRotationAngle: number;
	logoRotationRef: React.RefObject<SVGElement | null>;
}) {
	let { hydrated } = useRootContext();
	let [isPastScrollThreshold, setIsPastScrollThreshold] = React.useState(
		hydrated ? window.scrollY > headerThreshold : false
	);
	let [motionPreference, setMotionPreference] =
		React.useState<MotionPreference>("reduce");
	let [isMediumScreen, setIsMediumScreen] = React.useState(false);

	React.useEffect(() => {
		let mql = window.matchMedia("screen and (min-width: 768px)");
		setIsMediumScreen(mql.matches);
		mql.addEventListener("change", (e) => {
			setIsMediumScreen(e.matches);
		});
		return () => {
			mql.removeEventListener("change", () => {});
		};
	}, []);

	React.useEffect(() => {
		let mql = window.matchMedia("(prefers-reduced-motion: no-preference)");
		setMotionPreference(mql.matches ? "no-preference" : "reduce");
		mql.addEventListener("change", (e) => {
			setMotionPreference(e.matches ? "no-preference" : "reduce");
		});
		return () => {
			mql.removeEventListener("change", () => {});
		};
	}, []);

	React.useEffect(() => {
		let prevScrollY = window.scrollY;
		let rotationAngle = 0;
		let logoTextElement = logoRotationRef.current;
		let rafId: number;
		let scheduledAnimationFrame = false;

		update(true);

		function update(init?: boolean) {
			if (!logoTextElement) {
				console.warn("No logo text element found");
			}

			if (
				logoTextElement &&
				motionPreference === "no-preference" &&
				isMediumScreen &&
				// Shit looks laggy on Safari (what a surprise!) so just don't bother
				!isWebKit()
			) {
				rotationAngle = init
					? 0
					: prevScrollY > scrollY
					? rotationAngle - logoRotationAngle
					: rotationAngle + logoRotationAngle;
				logoTextElement.style.setProperty(
					"transform",
					`rotate(${rotationAngle}deg)`
				);
			}
			setIsPastScrollThreshold(scrollY > headerThreshold);
			scheduledAnimationFrame = false;
		}

		let handleScroll = (event: Event) => {
			let scrollY = window.scrollY;
			if (scrollY === prevScrollY || scheduledAnimationFrame) {
				return;
			}

			if (scrollY === prevScrollY) {
				return;
			}

			rafId = window.requestAnimationFrame(() => update());
			prevScrollY = scrollY;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.cancelAnimationFrame(rafId);
		};
	}, [
		motionPreference,
		isMediumScreen,
		headerThreshold,
		logoRotationAngle,
		logoRotationRef,
	]);
	return isPastScrollThreshold;
}

type MotionPreference = "reduce" | "no-preference";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LogoOld({ ...props }: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg {...props} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
			<rect x="0" y="0" width="400" height="400" className="fill-[inherit]" />
			<g className="fill-white">
				<path d="m 109.2952,303.95 c -6.067,0 -10.562,-2.047 -13.487,-6.142 -2.925,-4.095 -4.388,-9.869 -4.388,-17.323 0,-7.453 1.463,-13.227 4.388,-17.322 2.925,-4.095 7.42,-6.143 13.487,-6.143 2.34,0 4.409,0.314 6.208,0.943 1.798,0.628 3.347,1.506 4.647,2.632 1.3,1.127 2.373,2.492 3.218,4.095 0.845,1.604 1.505,3.402 1.982,5.395 l -9.1,2.21 c -0.26,-1.083 -0.563,-2.08 -0.91,-2.99 -0.347,-0.91 -0.791,-1.69 -1.332,-2.34 -0.542,-0.65 -1.214,-1.159 -2.015,-1.527 -0.802,-0.369 -1.766,-0.553 -2.893,-0.553 -2.643,0 -4.517,1.029 -5.622,3.088 -1.105,2.058 -1.658,4.907 -1.658,8.547 v 7.93 c 0,3.64 0.553,6.489 1.658,8.548 1.105,2.058 2.979,3.087 5.622,3.087 2.253,0 3.889,-0.693 4.908,-2.08 1.018,-1.386 1.765,-3.163 2.242,-5.33 l 9.1,2.21 c -0.477,1.994 -1.137,3.792 -1.982,5.395 -0.845,1.604 -1.918,2.979 -3.218,4.128 -1.3,1.148 -2.849,2.026 -4.647,2.632 -1.799,0.607 -3.868,0.91 -6.208,0.91 z" />
				<path d="m 152.9752,284.19 h -11.44 v 18.98 h -9.815 V 257.8 h 9.815 v 18.395 h 11.44 V 257.8 h 9.815 v 45.37 h -9.815 z" />
				<path d="m 195.0302,303.17 -2.86,-10.92 h -12.415 l -2.795,10.92 h -9.88 l 12.285,-45.37 h 13.78 l 12.285,45.37 z m -8.775,-35.945 h -0.52 l -4.42,17.16 h 9.36 z" />
				<path d="m 218.7552,273.01 h -0.715 v 30.16 h -8.32 V 257.8 h 11.7 l 10.335,30.16 h 0.715 V 257.8 h 8.32 v 45.37 h -11.7 z" />
				<path d="m 265.2952,303.95 c -6.067,0 -10.562,-2.047 -13.487,-6.142 -2.925,-4.095 -4.388,-9.869 -4.388,-17.323 0,-7.453 1.463,-13.227 4.388,-17.322 2.925,-4.095 7.42,-6.143 13.487,-6.143 2.34,0 4.409,0.314 6.208,0.943 1.798,0.628 3.347,1.506 4.647,2.632 1.3,1.127 2.373,2.492 3.218,4.095 0.845,1.604 1.505,3.402 1.982,5.395 l -9.1,2.21 c -0.26,-1.083 -0.563,-2.08 -0.91,-2.99 -0.347,-0.91 -0.791,-1.69 -1.332,-2.34 -0.542,-0.65 -1.214,-1.159 -2.015,-1.527 -0.802,-0.369 -1.766,-0.553 -2.893,-0.553 -2.643,0 -4.517,1.029 -5.622,3.088 -1.105,2.058 -1.658,4.907 -1.658,8.547 v 7.93 c 0,3.64 0.553,6.489 1.658,8.548 1.105,2.058 2.979,3.087 5.622,3.087 2.253,0 3.889,-0.693 4.908,-2.08 1.018,-1.386 1.765,-3.163 2.242,-5.33 l 9.1,2.21 c -0.477,1.994 -1.137,3.792 -1.982,5.395 -0.845,1.604 -1.918,2.979 -3.218,4.128 -1.3,1.148 -2.849,2.026 -4.647,2.632 -1.799,0.607 -3.868,0.91 -6.208,0.91 z" />
				<path d="M 288.9552,303.17 V 257.8 h 28.99 v 7.995 h -19.24 v 10.4 h 18.59 v 7.995 h -18.59 v 10.985 h 19.24 v 7.995 z" />
				<path d="m 113.1302,323.795 v 37.375 h -9.75 V 323.795 H 90.3152 V 315.8 h 35.88 v 7.995 z" />
				<path d="m 152.9752,342.19 h -11.44 v 18.98 h -9.815 V 315.8 h 9.815 v 18.395 h 11.44 V 315.8 h 9.815 v 45.37 h -9.815 z" />
				<path d="M 171.9552,361.17 V 315.8 h 28.99 v 7.995 h -19.24 v 10.4 h 18.59 v 7.995 h -18.59 v 10.985 h 19.24 v 7.995 z" />
				<path d="m 248.9152,315.8 h 14.625 c 6.11,0 10.638,1.95 13.585,5.85 2.947,3.9 4.42,9.512 4.42,16.835 0,7.324 -1.473,12.935 -4.42,16.835 -2.947,3.9 -7.475,5.85 -13.585,5.85 h -14.625 z m 13.975,37.7 c 2.903,0 5.027,-0.931 6.37,-2.795 1.343,-1.863 2.015,-4.571 2.015,-8.125 v -8.255 c 0,-3.51 -0.672,-6.196 -2.015,-8.06 -1.343,-1.863 -3.467,-2.795 -6.37,-2.795 h -4.355 v 30.03 z" />
				<path d="M 288.9552,361.17 V 315.8 h 28.99 v 7.995 h -19.24 v 10.4 h 18.59 v 7.995 h -18.59 v 10.985 h 19.24 v 7.995 z" />
				<path d="m 335.3652,361.17 -12.025,-45.37 h 10.855 l 5.33,23.075 2.665,13.065 h 0.52 l 2.73,-13.065 5.395,-23.075 h 10.335 l -12.025,45.37 z" />
			</g>
			<path
				d="m 38.8297,293.81 19.305,-10.205 v -0.52 L 38.8297,272.88 v -8.97 l 27.95,14.95 v 8.97 l -27.95,14.95 z"
				className="fill-blue-300"
			/>
		</svg>
	);
}
