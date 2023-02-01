import * as vscode from "vscode";

export default function ExpressButton() {
	const installExpress = async () => {
		const terminal = vscode.window.createTerminal("Express Terminal");
		//const terminal = vscode.window.createTerminal();
		terminal.show();
		terminal.sendText("npm install express");
	};

	return <button onClick={installExpress}>Install Express</button>;
}
