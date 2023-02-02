import {
	WebviewViewProvider,
	WebviewView,
	Webview,
	Uri,
	EventEmitter,
	window,
} from "vscode";
import * as vscode from "vscode";
import { Utils } from "utils";
import LeftPanel from "components/LeftPanel";
import * as ReactDOMServer from "react-dom/server";
import { SerialPort } from "../serial/serialPort";
import * as ocflasher from "../extConfiguration";

let workspaceRoot: vscode.Uri;

export class LeftPanelWebview implements WebviewViewProvider {
	constructor(
		private readonly extensionPath: Uri,
		private data: any,
		private _view: any = null
	) {}
	private onDidChangeTreeData: EventEmitter<any | undefined | null | void> =
		new EventEmitter<any | undefined | null | void>();

	refresh(context: any): void {
		this.onDidChangeTreeData.fire(null);
		this._view.webview.html = this._getHtmlForWebview(this._view?.webview);
	}

	//called when a view first becomes visible
	resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.extensionPath],
		};
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
		this._view = webviewView;
		this.activateMessageListener();
	}

	private activateMessageListener() {
		this._view.webview.onDidReceiveMessage((message) => {
			workspaceRoot = vscode.workspace.workspaceFolders[0].uri;

			switch (message.action) {
				case "SHOW_WARNING_LOG": {
					window.showWarningMessage(message.data.message);
					break;
				}

				case "OPEN_NEW_TERMINAL": {
					window.showWarningMessage(message.data.message);
					const terminal = window.createTerminal({
						name: "This is your new terminal",
						hideFromUser: false,
					});
					terminal.show();
					break;
				}

				case "GET_SERIAL_PORT_LIST": {
					ocflasher
						.writeParameter(
							"oc-flasher.serialPorts",
							[],
							vscode.ConfigurationTarget.Workspace
						)
						.then((res) => {
							console.log("RES: ", res);
						});
					SerialPort.shared()
						.list()
						.then((ports) => {
							this.data = ports;
							this.refresh(this.data);
						});
					break;
				}

				case "ADD_PORT_TO_FLASH_LIST": {
					const ports = ocflasher.readParameter(
						"oc-flasher.serialPorts",
						workspaceRoot
					) as Array<string>;
					ports.push(message.data.message);
					ocflasher
						.writeParameter(
							"oc-flasher.serialPorts",
							ports,
							vscode.ConfigurationTarget.Workspace
						)
						.then((res) => {
							console.log("RES: ", res);
						});
					break;
				}

				case "REMOVE_PORT_FROM_FLASH_LIST": {
					const ports = ocflasher.readParameter(
						"oc-flasher.serialPorts",
						workspaceRoot
					) as Array<string>;
					const updatedPorts = ports.filter(
						(port) => port !== message.data.message
					);
					ocflasher
						.writeParameter(
							"oc-flasher.serialPorts",
							updatedPorts,
							vscode.ConfigurationTarget.Workspace
						)
						.then((res) => {
							console.log("RES: ", res);
						});
					break;
				}

				case "FLASH_SERIAL_PORT_LIST": {
					const ports = ocflasher.readParameter(
						"oc-flasher.serialPorts",
						workspaceRoot
					) as Array<string>;

					console.log("Flash", ports);
					break;
				}
				default:
					break;
			}
		});
	}

	private _getHtmlForWebview(webview: Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		// Script to handle user action
		const scriptUri = webview.asWebviewUri(
			Uri.joinPath(
				this.extensionPath,
				"script",
				"left-webview-provider.js"
			)
		);
		const constantUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "constant.js")
		);
		// CSS file to handle styling
		const styleUri = webview.asWebviewUri(
			Uri.joinPath(
				this.extensionPath,
				"script",
				"left-webview-provider.css"
			)
		);

		//vscode-icon file from codicon lib
		const codiconsUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "codicon.css")
		);

		// Use a nonce to only allow a specific script to be run.
		const nonce = Utils.getNonce();

		return `<html>
                <head>
                    <meta charSet="utf-8"/>
                    <meta http-equiv="Content-Security-Policy" 
                            content="default-src 'none';
                            img-src vscode-resource: https:;
                            font-src ${webview.cspSource};
                            style-src ${webview.cspSource} 'unsafe-inline';
                            script-src 'nonce-${nonce}'
							
							;">             

                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="${codiconsUri}" rel="stylesheet" />
                    <link href="${styleUri}" rel="stylesheet">

                </head>
                <body>
                    ${ReactDOMServer.renderToString(
						<LeftPanel
							message={
								"OC-Flasher: Select the serial ports to flash"
							}
							serialPorts={this.data?.length > 0 ? this.data : []}
						></LeftPanel>
					)}
					<script nonce="${nonce}" type="text/javascript" src="${constantUri}"></script>
					<script nonce="${nonce}" src="${scriptUri}"></script>
				</body>
            </html>`;
	}
}
