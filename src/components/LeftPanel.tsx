/* eslint-disable @typescript-eslint/naming-convention */
import Button from "components/Button";
import GetSerialPortsButton from "components/GetSerialPortsButton";
import SerialPortOption from "components/SerialPortOption";
import ExpressButton from "./ExpressButton";

interface LeftPanelProp {
	message: string;
	serialPorts: string[];
}

function LeftPanel({ message, serialPorts = [] }: LeftPanelProp) {
	console.log("serialPorts", serialPorts);
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
		</div>
	);
}

export default LeftPanel;
