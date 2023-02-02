/* eslint-disable @typescript-eslint/naming-convention */
import Button from "components/Button";
import GetSerialPortsButton from "components/GetSerialPortsButton";
import FlashPortsButton from "components/FlashPortsButton";
import SerialPortOption from "components/SerialPortOption";
import ExpressButton from "./ExpressButton";

interface LeftPanelProp {
	message: string;
	serialPorts: string[];
}

function LeftPanel({ message, serialPorts = [] }: LeftPanelProp) {
	return (
		<div className="panel-wrapper">
			<span className="panel-info">{message}</span>
			<Button></Button>
			<GetSerialPortsButton />
			<ul>
				{serialPorts.map((port) => (
					<SerialPortOption key={port} serialPort={port} />
				))}
			</ul>
			<FlashPortsButton />
		</div>
	);
}

export default LeftPanel;
