/* eslint-disable @typescript-eslint/naming-convention */
import { EXTENSION_CONSTANT } from "constant";
function FlashPortsButton() {
	return (
		<button id={EXTENSION_CONSTANT.ELEMENT_IDS.FLASH_SERIAL_PORTS_BUTTON}>
			Flash Serial Ports
		</button>
	);
}

export default FlashPortsButton;
