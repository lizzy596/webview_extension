import * as vscode from "vscode";
import { spawn } from "../utils";


export class SerialPort {
  public static shared(): SerialPort {
    if (!SerialPort.instance) {
      SerialPort.instance = new SerialPort();
    }
    return SerialPort.instance;
  }
  public static instance: SerialPort;
  public constructor() {}

  public async getListArray() {
    return await this.list();
  }

  public list(): Thenable<string[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const pythonBinPath = "/opt/homebrew/bin/python3";
        const buff = await spawn(pythonBinPath, ["get_serial_list.py"]);
        const regexp = /\'(.*?)\'/g;
        const arrayPrint = buff.toString().match(regexp);
      
        const choices: string[] = Array<string>();

        if (arrayPrint) {
          arrayPrint.forEach((portStr) => {
            const portChoice = portStr.replace(/'/g, "").trim();
            choices.push(portChoice);
          });
          
          resolve(choices);
        } else {
          reject(new Error("No serial ports found"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}