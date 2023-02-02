(function () {
    const vscode = acquireVsCodeApi();
    document.getElementById(ELEMENT_IDS.TRIGGER_MESSAGE_BUTTON).addEventListener('click', async () => {
        vscode.postMessage({
            action: POST_MESSAGE_ACTION.SHOW_WARNING_LOG,
            data: {
                message: "You just clicked on the left panel webview button"
            }
        });
    });
    document.getElementById(ELEMENT_IDS.GET_SERIAL_PORTS_BUTTON).addEventListener('click', async () => {
        vscode.postMessage({
            action: POST_MESSAGE_ACTION.GET_SERIAL_PORT_LIST,
            data: {
                message: "Get Serial ports"
            }
        });
    });
}());