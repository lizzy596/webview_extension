/* eslint-disable @typescript-eslint/naming-convention */
import Button from "components/Button";
import ExpressButton from "./ExpressButton";

interface LeftPanelProp {
	message: string;
}

function LeftPanel({ message }: LeftPanelProp) {
	return (
		<div className="panel-wrapper">
			<span className="panel-info">{message}</span>
			<ExpressButton></ExpressButton>
		</div>
	);
}

export default LeftPanel;
