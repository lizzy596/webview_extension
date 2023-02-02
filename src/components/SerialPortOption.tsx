/* eslint-disable @typescript-eslint/naming-convention */
import { EXTENSION_CONSTANT } from "constant";
function SerialPortOption({ serialPort }: { serialPort: string }) {
	return (
		<li className="serial-option">
			<input
				type="checkbox"
				id={serialPort}
				name={EXTENSION_CONSTANT.ELEMENT_NAMES.SERIAL_PORT_OPTION_INPUT}
				value={serialPort}
			/>
			<label htmlFor={serialPort}>{serialPort}</label>
			<br></br>
		</li>
	);
}

export default SerialPortOption;
