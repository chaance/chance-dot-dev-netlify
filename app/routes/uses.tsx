// import { redirect } from "@remix-run/node";
import { SiteHeader } from "~/ui/site-header";
import { SiteFooter } from "~/ui/site-footer";
import { Container } from "~/ui/container";
import type { MetaFunction } from "@remix-run/node";

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

function PrimaryLayout({ children }: React.PropsWithChildren<{}>) {
	return (
		<div className="flex flex-col min-h-screen">
			<SiteHeader />
			<div className="flex-auto">{children}</div>
			<SiteFooter includeTopMargin={false} />
		</div>
	);
}

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
				title: "Microphone Arm",
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
				title: "Acoustic Drums",
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
				title: "Snowboard Bindings",
				desc: "RIDE CL-4",
				url: "https://garageskateshop.com/products/ride-cl-4-snow-bindings",
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
		<PrimaryLayout>
			<Container className="flex-1">
				<main>
					<h1 className="text-blue-800 dark:text-blue-100 relative font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 lg:mb-7">
						Things I Use
					</h1>
					<div className="flex flex-col gap-7 sm:gap-9">
						{ITEMS.map(({ title, list }) => {
							return (
								<div key={title}>
									<h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2">
										{title}
									</h2>
									<dl>
										{list.map(({ title, desc, url }) => {
											return (
												<div key={title + desc} className="mb-1">
													<dt className="font-bold text-blue-700 dark:text-blue-200 block sm:inline">
														{url ? <a href={url}>{title}</a> : title}:
													</dt>{" "}
													<dd className="block sm:inline">{desc}</dd>
												</div>
											);
										})}
									</dl>
								</div>
							);
						})}
					</div>
				</main>
			</Container>
		</PrimaryLayout>
	);
}
