/* eslint-disable @typescript-eslint/naming-convention */
import Button from "components/Button";
import GetSerialPortsButton from "components/GetSerialPortsButton";
import ExpressButton from "./ExpressButton";

interface LeftPanelProp {
	message: string;
}

function LeftPanel({ message }: LeftPanelProp) {
	return (
		<div className="panel-wrapper">
			<span className="panel-info">{message}</span>
			<Button></Button>
			<GetSerialPortsButton />
		</div>
	);
}

export default LeftPanel;
