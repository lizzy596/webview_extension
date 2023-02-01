/* eslint-disable @typescript-eslint/naming-convention */
import { EXTENSION_CONSTANT } from "constant";
function GetSerialPortsButton() {
	return (
		<button id={EXTENSION_CONSTANT.ELEMENT_IDS.GET_SERIAL_PORTS_BUTTON}>
			Get Serial Ports
		</button>
	);
}

export default GetSerialPortsButton;
