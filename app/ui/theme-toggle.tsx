import * as React from "react";
import { Switch } from "~/ui/switch";

export function ThemeToggle({ onToggle, checked }: ThemeToggleProps) {
	return (
		<div className="flex items-center">
			<Switch
				checked={checked}
				onToggle={onToggle}
				className={`inline-flex items-center px-0.5 rounded-full w-18 h-9 ${
					checked ? "justify-end" : ""
				}`}
				aria-label="Toggle dark mode"
				// style={{ backgroundColor: checked ? "#000" : "#60D360", width: 32 }}
			/>
		</div>
	);
}

export interface ThemeToggleProps {
	onToggle: (checked: boolean | ((prevChecked: boolean) => boolean)) => void;
	checked: boolean;
}
