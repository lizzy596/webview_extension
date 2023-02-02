import * as vscode from "vscode";
import { ESP } from "./config";

export function addWinIfRequired(param: string) {
  const winFlag = process.platform === "win32" ? "Win" : "";
  for (const platDepConf of ESP.platformDepConfigurations) {
    if (param.indexOf(platDepConf) >= 0) {
      return param + winFlag;
    }
  }
  return param;
}

export function readParameter(
  param: string,
  scope?: vscode.ConfigurationScope
) {
  const paramUpdated = addWinIfRequired(param);
  const paramValue = vscode.workspace
    .getConfiguration("", scope)
    .get(paramUpdated);
  if (typeof paramValue === "undefined") {
    return "";
  }
  if (typeof paramValue === "string") {
    return resolveVariables(paramValue, scope);
  }
  return paramValue;
}

export function resolveVariables(
  configPath: string,
  scope?: vscode.ConfigurationScope
) {
  const regexp = /\$\{(.*?)\}/g; // Find ${anything}
  return configPath.replace(regexp, (match: string, name: string) => {
    if (match.indexOf("config:") > 0) {
      const configVar = name.substring(
        name.indexOf("config:") + "config:".length
      );
      const configVarValue = readParameter(configVar, scope);
      return resolveVariables(configVarValue, scope);
    }
    if (match.indexOf("env:") > 0) {
      const envVariable = name.substring(name.indexOf("env:") + "env:".length);
      if (Object.keys(process.env).indexOf(envVariable) === -1) {
        return "";
      }
      return process.env[envVariable];
    }
    if (scope && match.indexOf("workspaceFolder") > 0) {
      return scope instanceof vscode.Uri ? scope.fsPath : scope.uri.fsPath;
    }
    return match;
  });
}