/* eslint-disable @typescript-eslint/naming-convention */

function SerialPortOption({ serialPort }: { serialPort: string }) {
	return (
		<li className="serial-option">
			{/* <span className="serial-option">{serialPort}</span> */}
			<input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
			<label htmlFor="vehicle1">{serialPort}</label>
			<br></br>
		</li>
	);
}

export default SerialPortOption;
