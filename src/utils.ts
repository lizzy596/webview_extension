import * as childProcess from "child_process";
import * as path from "path";
import { EOL } from "os";

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