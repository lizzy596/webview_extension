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
    document.getElementsByName(ELEMENT_NAMES.SERIAL_PORT_OPTION_INPUT).forEach((port) => {
        port.addEventListener("click", (e) => {
            if (e.target.checked) {
                vscode.postMessage({
                    action: POST_MESSAGE_ACTION.ADD_PORT_TO_FLASH_LIST,
                    data: {
                        message: e.target.value
                    }
                });
            } else {
                vscode.postMessage({
                    action: POST_MESSAGE_ACTION.REMOVE_PORT_FROM_FLASH_LIST,
                    data: {
                        message: e.target.value
                    }
                });
            }

        })
    });
    document.getElementById(ELEMENT_IDS.FLASH_SERIAL_PORTS_BUTTON).addEventListener('click', async () => {
        vscode.postMessage({
            action: POST_MESSAGE_ACTION.FLASH_SERIAL_PORT_LIST,
            data: {
                message: "Flash ports"
            }
        });
    });
}());