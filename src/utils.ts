import * as vscode from "vscode";
import * as childProcess from "child_process";
import * as path from "path";
import { EOL } from "os";
import { ESP } from "./config";
import * as ocflasher from './extConfiguration';
import * as fs from "fs";

export let extensionContext: vscode.ExtensionContext;

export function setExtensionContext(context: vscode.ExtensionContext): void {
  extensionContext = context;
}

export const packageJson = vscode.extensions.getExtension(ESP.extensionID)
  .packageJSON;

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function spawn(
    command: string,
    args: string[] = [],
    options: any = {}
  ): Promise<Buffer> {
    let buff = Buffer.alloc(0);
    const sendToOutputChannel = (data: Buffer) => {
      buff = Buffer.concat([buff, data]);
    };
    return new Promise((resolve, reject) => {
      options.cwd = options.cwd || path.resolve(path.join(__dirname, ".."));
      const child = childProcess.spawn(command, args, options);
  
      child.stdout.on("data", sendToOutputChannel);
      child.stderr.on("data", sendToOutputChannel);
  
      child.on("error", (error) => reject(error));
  
      child.on("exit", (code) => {
        if (code === 0) {
          resolve(buff);
        } else {
          const err = new Error("non zero exit code " + code + EOL + EOL + buff);
          //Logger.error(err.message, err);
          reject(err);
        }
      });
    });
  }

export const Utils = {
    getNonce,
};

export function canAccessFile(filePath: string, mode?: number): boolean {
  try {
    // tslint:disable-next-line: no-bitwise
    mode = mode || fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK;
    fs.accessSync(filePath, mode);
    return true;
  } catch (error) {
    //Logger.error(`Cannot access filePath: ${filePath}`, error);
    return false;
  }
}

export function appendIdfAndToolsToPath(curWorkspace: vscode.Uri) {
  const modifiedEnv: { [key: string]: string } = <{ [key: string]: string }>(
    Object.assign({}, process.env)
  );
  const extraPaths = ocflasher.readParameter(
    "idf.customExtraPaths",
    curWorkspace
  );

  const customVarsString = ocflasher.readParameter(
    "idf.customExtraVars",
    curWorkspace
  ) as string;
  if (customVarsString) {
    try {
      const customVars = JSON.parse(customVarsString);
      for (const envVar in customVars) {
        if (envVar) {
          modifiedEnv[envVar] = customVars[envVar];
        }
      }
    } catch (error) {
      //Logger.errorNotify("Invalid custom environment variables format", error);
    }
  }

  const containerPath =
    process.platform === "win32" ? process.env.USERPROFILE : process.env.HOME;
  const defaultEspIdfPath = path.join(containerPath, "esp", "esp-idf");

  const idfPathDir = ocflasher.readParameter("idf.espIdfPath", curWorkspace);
  modifiedEnv.IDF_PATH =
    idfPathDir || process.env.IDF_PATH || defaultEspIdfPath;

  const adfPathDir = ocflasher.readParameter("idf.espAdfPath", curWorkspace);
  modifiedEnv.ADF_PATH = adfPathDir || process.env.ADF_PATH;

  const mdfPathDir = ocflasher.readParameter("idf.espMdfPath", curWorkspace);
  modifiedEnv.MDF_PATH = mdfPathDir || process.env.MDF_PATH;

  const defaultToolsPath = path.join(containerPath, ".espressif");
  const toolsPath = ocflasher.readParameter(
    "idf.toolsPath",
    curWorkspace
  ) as string;
  modifiedEnv.IDF_TOOLS_PATH = toolsPath || defaultToolsPath;
  const matterPathDir = ocflasher.readParameter("idf.espMatterPath") as string;
  modifiedEnv.ESP_MATTER_PATH = matterPathDir || process.env.ESP_MATTER_PATH;

  let pathToPigweed: string;

  if (modifiedEnv.ESP_MATTER_PATH) {
    pathToPigweed = path.join(
      modifiedEnv.ESP_MATTER_PATH,
      "connectedhomeip",
      "connectedhomeip",
      ".environment",
      "cipd",
      "packages",
      "pigweed"
    );
    modifiedEnv.ESP_MATTER_DEVICE_PATH = path.join(
      modifiedEnv.ESP_MATTER_PATH,
      "device_hal",
      "device",
      "m5stack"
    );
  }

  modifiedEnv.PYTHON =
    `${ocflasher.readParameter("idf.pythonBinPath", curWorkspace)}` ||
    `${process.env.PYTHON}` ||
    `${path.join(process.env.IDF_PYTHON_ENV_PATH, "bin", "python")}`;

  modifiedEnv.IDF_PYTHON_ENV_PATH =
    path.dirname(path.dirname(modifiedEnv.PYTHON)) ||
    process.env.IDF_PYTHON_ENV_PATH;

  const gitPath = ocflasher.readParameter("idf.gitPath", curWorkspace) as string;
  let pathToGitDir;
  if (gitPath && gitPath !== "git") {
    pathToGitDir = path.dirname(gitPath);
  }

  let IDF_ADD_PATHS_EXTRAS = path.join(
    modifiedEnv.IDF_PATH,
    "components",
    "esptool_py",
    "esptool"
  );
  IDF_ADD_PATHS_EXTRAS = `${IDF_ADD_PATHS_EXTRAS}${path.delimiter}${path.join(
    modifiedEnv.IDF_PATH,
    "components",
    "espcoredump"
  )}`;
  IDF_ADD_PATHS_EXTRAS = `${IDF_ADD_PATHS_EXTRAS}${path.delimiter}${path.join(
    modifiedEnv.IDF_PATH,
    "components",
    "partition_table"
  )}`;

  let pathNameInEnv: string;
  if (process.platform === "win32") {
    pathNameInEnv = "Path";
  } else {
    pathNameInEnv = "PATH";
  }
  if (pathToGitDir) {
    modifiedEnv[pathNameInEnv] =
      pathToGitDir + path.delimiter + modifiedEnv[pathNameInEnv];
  }
  if (pathToPigweed) {
    modifiedEnv[pathNameInEnv] =
      pathToPigweed + path.delimiter + modifiedEnv[pathNameInEnv];
  }
  modifiedEnv[pathNameInEnv] =
    path.dirname(modifiedEnv.PYTHON) +
    path.delimiter +
    path.join(modifiedEnv.IDF_PATH, "tools") +
    path.delimiter +
    modifiedEnv[pathNameInEnv];

  if (
    modifiedEnv[pathNameInEnv] &&
    !modifiedEnv[pathNameInEnv].includes(extraPaths)
  ) {
    modifiedEnv[pathNameInEnv] =
      extraPaths + path.delimiter + modifiedEnv[pathNameInEnv];
  }
  modifiedEnv[
    pathNameInEnv
  ] = `${IDF_ADD_PATHS_EXTRAS}${path.delimiter}${modifiedEnv[pathNameInEnv]}`;

  let idfTarget = ocflasher.readParameter("idf.adapterTargetName", curWorkspace);
  if (idfTarget === "custom") {
    idfTarget = ocflasher.readParameter(
      "idf.customAdapterTargetName",
      curWorkspace
    );
  }
  modifiedEnv.IDF_TARGET = idfTarget || process.env.IDF_TARGET;

  let enableComponentManager = ocflasher.readParameter(
    "idf.enableIdfComponentManager",
    curWorkspace
  ) as boolean;

  if (enableComponentManager) {
    modifiedEnv.IDF_COMPONENT_MANAGER = "1";
  }

  return modifiedEnv;
}