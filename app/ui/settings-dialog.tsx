import { Form, useLocation } from "@remix-run/react";
import { CloseIcon } from "~/ui/icons";
import { Switch } from "~/ui/switch";

export function SettingsDialog({
	id,
	enableScripts,
}: {
	id: string;
	enableScripts: boolean;
}) {
	const TITLE_ID = `${id}--title`;
	let location = useLocation();
	let toggleProps = {
		"aria-describedby": `${id}--scripts-desc`,
		name: "toggle",
		defaultChecked: enableScripts,
	};

	return (
		<div
			className="z-20"
			id={id}
			role="dialog"
			aria-hidden
			aria-modal
			tabIndex={-1}
			aria-labelledby={TITLE_ID}
			data-a11y-dialog-root
		>
			<div className="" data-a11y-dialog-overlay data-a11y-dialog-hide></div>
			<div
				role="document"
				data-a11y-dialog-content
				className="p-4 pt-7 md:p-8 md:pt-12 bg-gray-50 dark:bg-gray-950 sm:border-[1px] sm:border-gray-400 sm:dark:border-gray-600 sm:rounded-md"
			>
				<button
					type="button"
					data-a11y-dialog-hide
					aria-label="Close settings window"
					title="Close settings window"
					className="absolute right-4 top-4 p-3 -mt-3 -mr-3 sm:top-6 sm:right-6 sm:p-1 sm:-mt-3 sm:-mr-3 leading-none text-lg z-10"
				>
					<CloseIcon
						title={null}
						className="text-current w-5 h-5 sm:w-7 sm:h-7"
					/>
				</button>
				<div className="prose mb-3 sm:mb-6 ml-4 sm:ml-6">
					<h1 id={TITLE_ID} className="text-xl sm:text-2xl font-bold">
						Site Settings
					</h1>
				</div>

				<Form
					reloadDocument
					method="post"
					action="/toggle-scripts"
					className="accent-blue-600 dark:accent-blue-400"
				>
					<div className="flex flex-col gap-4 sm:gap-8">
						{/* PROGRESSIVE ENHANCEMENT */}
						<div role="group" aria-labelledby={`${id}--prog`}>
							<h2
								className="mb-1 sm:mb-2 ml-4 sm:ml-6 text-sm uppercase"
								id={`${id}--prog`}
							>
								Progressive Enhancement
							</h2>
							<div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-md">
								<div className="flex flex-col">
									<div>
										<p id={`${id}--scripts-desc`}>
											This site may optionally load scripts that can enhance the
											experience.{" "}
											<span className="font-bold">
												These scripts are currently {enableScripts}.
											</span>
										</p>
										<label className="flex justify-between items-center py-4">
											<span>Enable scripts</span>
											{enableScripts ? (
												<Switch {...toggleProps} />
											) : (
												<input type="checkbox" {...toggleProps} />
											)}
										</label>
									</div>
								</div>
							</div>
						</div>

						<div>
							<input type="hidden" name="_redirect" value={location.pathname} />
							<button
								type="submit"
								className="text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 font-bold py-3 px-5 rounded transition-colors"
							>
								Save Preferences
							</button>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
}
