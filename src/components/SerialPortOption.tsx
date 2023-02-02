/* eslint-disable @typescript-eslint/naming-convention */

function SerialPortOption({ serialPort }: { serialPort: string }) {
	return (
		<li>
			<span>{serialPort}</span>
		</li>
	);
}

export default SerialPortOption;
