// import { redirect } from "@remix-run/node";
import { Container } from "~/ui/container";
import type { MetaFunction } from "@remix-run/node";

import routeStylesUrl from "~/dist/styles/routes/__main/uses.css";

export function links() {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
}

const ROOT_CLASS = "page--uses";

export const meta: MetaFunction = (args) => {
	let title = `Uses | chance.dev`;
	let description = "Tools I use to get the job (or hobby) done.";
	return {
		title,
		description: description,
		"og:description": description,
		"twitter:title": title,
		"twitter:description": description,
	};
};

interface UsesItem {
	title: string;
	list: Array<{
		title: string;
		desc: string;
		url?: string;
	}>;
}

const ITEMS: UsesItem[] = [
	{
		title: "Computer stuff",
		list: [
			{
				title: "Laptop",
				desc: '2021 MacBook Pro 16"',
			},
			{
				title: "Monitor",
				desc: "HP Z32",
				url: "https://www.bhphotovideo.com/c/product/1410160-REG/hp_hp_z32_31_5_4k.html",
			},
			{
				title: "Dock",
				desc: "CalDigit TS3 Plus",
				url: "https://www.caldigit.com/ts3-plus/",
			},
			{
				title: "Desk",
				desc: "UPLIFT V2 w/ acacia top",
				url: "https://www.upliftdesk.com/uplift-v2-standing-desk-v2-or-v2-commercial",
			},
			{
				title: "PC",
				desc: "Hacked together gamer circa 2018",
			},
		],
	},
	{
		title: "Apps",
		list: [
			{
				title: "Things",
				desc: "Todos and priority lists",
				url: "https://culturedcode.com/things/",
			},
			{
				title: "Fantastical",
				desc: "Excellent replacement for iCal",
				url: "https://flexibits.com/fantastical",
			},
			{
				title: "Raycast",
				desc: "A better Spotlight",
				url: "https://www.raycast.com/",
			},
			{
				title: "Warp",
				desc: "Super speedy terminal with great autocomplete",
				url: "https://www.warp.dev/",
			},
			{
				title: "VS Code",
				desc: "Isn't everyone?",
			},
			{
				title: "Spark",
				desc: "I hate email apps but I hate Spark the least (okay it's actually good)",
				url: "https://sparkmailapp.com/",
			},
		],
	},
	{
		title: "Audio/Video",
		list: [
			{
				title: "Camera",
				desc: "Sony A7 III",
				url: "https://electronics.sony.com/imaging/interchangeable-lens-cameras/full-frame/p/ilce7m3-b",
			},
			{
				title: "Microphone",
				desc: "Shure SM7b",
				url: "https://www.shure.com/en-US/products/microphones/sm7b",
			},
			{
				title: "Microphone arm",
				desc: "Yellowtec m!ka",
				url: "https://www.yellowtec.com/mika.html",
			},
			{
				title: "Audio processing",
				desc: "dbx 286s",
				url: "https://dbxpro.com/en/products/286s",
			},
			{
				title: "Interface",
				desc: "Focusrite Scarlett 18i20",
				url: "https://focusrite.com/en/usb-audio-interface/scarlett/scarlett-18i20",
			},
			{
				title: "Power",
				desc: "Furman M-8X2",
				url: "https://www.furmanpower.com/product/15a-standard-power-conditioner/",
			},
			{
				title: "Headphones amp",
				desc: "Mackie HM-4",
				url: "https://mackie.com/en/products/audio-tools/hm-series/HM_4.html/",
			},
		],
	},
	{
		title: "Music",
		list: [
			{
				title: "Acoustic guitar",
				desc: "2006 Taylor GS7",
				url: "https://reverb.com/item/51435409-taylor-gs-series-2006-gsrs-sitka-spruce-indian-rosewood",
			},
			{
				title: "Electric guitar",
				desc: "Fender Thinline Telecaster w/ Warmoth mohogany neck",
			},
			{
				title: "Amp",
				desc: "Vox AC-4",
			},
			{
				title: "Acoustic drums",
				desc: "Gretsch Renown Maple 5-piece",
			},
			{
				title: "Snare drum",
				desc: "Pork Pie patina brass 7x13",
				url: "https://www.guitarcenter.com/Pork-Pie/Brass-Patina-Snare-Drum-7-x-13-1274115053052.gc",
			},
			{
				title: "Electric drums",
				desc: "Roland TD-17KV",
				url: "https://www.roland.com/ca/products/td-17kv/",
			},
		],
	},
	{
		title: "Sports",
		list: [
			{
				title: "Snowboard",
				desc: "Burton Custom X",
				url: "https://www.burton.com/us/en/p/mens-burton-custom-x-camber-snowboard/W22-106891.html",
			},
			{
				title: "Snowboard bindings",
				desc: "RIDE CL-4",
				url: "https://ridesnowboards.com/en-us/p/cl-4-snowboard-bindings",
			},
			{
				title: "Skateboard deck",
				desc: "DGK",
				url: "https://dgkallday.com/products/drippy-uv-activated-skateboard-deck-1",
			},
			{
				title: "Skateboard bearings",
				desc: "Bones Swiss",
				url: "https://bonesbearings.com/bones-reg-swiss-skateboard-bearings-8-pack",
			},
			{
				title: "Skateboard wheels",
				desc: "Bones 53mm",
			},
			{
				title: "Skateboard trucks",
				desc: "Venture Hi",
			},
			{
				title: "Surfboard",
				desc: "Torq Mod Fun",
				url: "https://www.torq-surfboards.com/tet-mod-fun.html",
			},
		],
	},
];

export default function PrimaryLayoutRoute() {
	return (
		<div className={ROOT_CLASS}>
			<Container>
				<main>
					<h1 className={`${ROOT_CLASS}__title`}>Things I Use</h1>
					<div className={`${ROOT_CLASS}__inner`}>
						{ITEMS.map(({ title, list }) => {
							return <ItemGroup key={title} list={list} title={title} />;
						})}
					</div>
				</main>
			</Container>
		</div>
	);
}

function ItemGroup({ title, list }: { title: string; list: UsesItem["list"] }) {
	const ROOT_CLASS = "item-group";
	return (
		<div className={ROOT_CLASS}>
			<h2 className={`${ROOT_CLASS}__heading`}>{title}</h2>
			<dl className={`${ROOT_CLASS}__list`}>
				{list.map(({ title, desc, url }) => {
					return (
						<ListItem key={title + desc} title={title} desc={desc} url={url} />
					);
				})}
			</dl>
		</div>
	);
}

function ListItem({
	title,
	desc,
	url,
}: {
	title: string;
	desc: string;
	url: URL | string | undefined;
}) {
	const ROOT_CLASS = "list-item";
	return (
		<div className={ROOT_CLASS}>
			<dt className={`${ROOT_CLASS}__term`}>
				{url ? (
					<a
						href={typeof url === "string" ? url : url.toString()}
						className={`${ROOT_CLASS}__term-link`}
					>
						{title}
					</a>
				) : (
					title
				)}
				:
			</dt>{" "}
			<dd className={`${ROOT_CLASS}__desc`}>{desc}</dd>
		</div>
	);
}
