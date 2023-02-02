try {
	require("module-alias/register");
} catch (e) {
	console.log("module-alias import error !");
}
import * as vscode from "vscode";
import { EXTENSION_CONSTANT } from "constant";
import { LeftPanelWebview } from "providers/left-webview-provider";
import * as ocflasher from './extConfiguration';

let workspaceRoot: vscode.Uri;

export function activate(context: vscode.ExtensionContext) {

	workspaceRoot = vscode.workspace.workspaceFolders[0].uri;

	ocflasher.writeParameter("oc-flasher.serialPorts", [], vscode.ConfigurationTarget.Workspace).then((res) => {console.log("RES: ", res);});

	vscode.workspace.onDidChangeConfiguration(async (e) => {
		if(e.affectsConfiguration("oc-flasher")) {
			console.log("config changed");
		}
	});

	// This logs to the Debug console. Added it to show you how to log from here
	vscode.window.onDidOpenTerminal((terminal) => {
		console.log("Terminal opened. Total count: " + (<any>vscode.window).terminals.length);
	});

	// This creates an info popup, I just addded it to show you how to log from here
	vscode.window.onDidOpenTerminal((terminal: vscode.Terminal) => {
		vscode.window.showInformationMessage(`onDidOpenTerminal, name: ${terminal.name}`);
	});

	
	let helloWorldCommand = vscode.commands.registerCommand(
		"vscode-webview-extension-with-react.helloWorld",
		() => {
			vscode.window.showInformationMessage(
				"Hello World from vscode-webview-extension-with-react!"
			);
		}
	);
	context.subscriptions.push(helloWorldCommand);

	// Register view
	const leftPanelWebViewProvider = new LeftPanelWebview(context?.extensionUri, {});
	let view = vscode.window.registerWebviewViewProvider(
		EXTENSION_CONSTANT.LEFT_PANEL_WEBVIEW_ID,
		leftPanelWebViewProvider,
	);
	context.subscriptions.push(view);

};

// this method is called when your extension is deactivated
export function deactivate() {}

// function createStatusBarItem(
//   icon: string,
//   tooltip: string,
//   cmd: string,
//   priority: number
// ) {
//   const alignment: vscode.StatusBarAlignment = vscode.StatusBarAlignment.Left;
//   const statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
//   statusBarItem.text = icon;
//   statusBarItem.tooltip = tooltip;
//   statusBarItem.command = cmd;
//   statusBarItem.show();
//   return statusBarItem;
// }
