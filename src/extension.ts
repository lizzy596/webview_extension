try {
	require("module-alias/register");
} catch (e) {
	console.log("module-alias import error !");
}
import * as vscode from "vscode";
import { EXTENSION_CONSTANT } from "constant";
import { LeftPanelWebview } from "providers/left-webview-provider";
import * as ocflasher from './extConfiguration';
import { ESP } from "./config";
import { kill } from "process";
import { flashCommand } from "./flash/uartFlash";

let workspaceRoot: vscode.Uri;

let monitorTerminal: vscode.Terminal;

export function activate(context: vscode.ExtensionContext) {

	workspaceRoot = vscode.workspace.workspaceFolders[0].uri;

	ocflasher.writeParameter("oc-flasher.serialPorts", [], vscode.ConfigurationTarget.Workspace);

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

	vscode.window.onDidCloseTerminal(async (terminal: vscode.Terminal) => {
    const terminalPid = await terminal.processId;
    const monitorTerminalPid = monitorTerminal
      ? await monitorTerminal.processId
      : -1;
    if (monitorTerminalPid === terminalPid) {
      monitorTerminal = undefined;
      kill(monitorTerminalPid, "SIGKILL");
    }
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

	let flashUart = vscode.commands.registerCommand("oc-flasher.flashUart", () =>
	  flash(false)
  );
	context.subscriptions.push(flashUart);

	// Register view
	const leftPanelWebViewProvider = new LeftPanelWebview(context?.extensionUri, {});
	let view = vscode.window.registerWebviewViewProvider(
		EXTENSION_CONSTANT.LEFT_PANEL_WEBVIEW_ID,
		leftPanelWebViewProvider,
	);
	context.subscriptions.push(view);

};

// this method is called when your extension is deactivated
export function deactivate() {
	console.log("deactivate");
}

const flash = async (
  encryptPartition: boolean = false,
) => {
    await vscode.window.withProgress(
      {
        cancellable: true,
        location: vscode.ProgressLocation.Notification,
        title: "Flashing Project",
      },
      async (
        progress: vscode.Progress<{ message: string; increment: number }>,
        cancelToken: vscode.CancellationToken
      ) => {
        
        await startFlashing(cancelToken, ESP.FlashType.UART, encryptPartition);
      }
    );
};

async function startFlashing(
  cancelToken: vscode.CancellationToken,
  flashType: ESP.FlashType,
  encryptPartitions: boolean
) {
  if (!flashType) {
    flashType = ESP.FlashType.UART;
  }

  const port = ocflasher.readParameter("idf.port", workspaceRoot);
  
	const flashBaudRate = ocflasher.readParameter(
    "idf.flashBaudRate",
    workspaceRoot
  );
  if (monitorTerminal) {
    monitorTerminal.sendText(ESP.CTRL_RBRACKET);
  }
  // const canFlash = await verifyCanFlash(flashBaudRate, port, workspaceRoot);
  // if (!canFlash) {
  //   return;
  // }

    const idfPathDir = ocflasher.readParameter(
      "idf.espIdfPath",
      workspaceRoot
    ) as string;


    return await flashCommand(
      cancelToken,
      flashBaudRate,
      idfPathDir,
      port,
      workspaceRoot,
      flashType,
      encryptPartitions
    );
}

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
