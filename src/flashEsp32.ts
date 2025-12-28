import * as vscode from "vscode";
import { spawn } from "child_process";
import * as path from "path";
import { findEsp32Port } from "./serial";

export async function flashEsp32(ctx: vscode.ExtensionContext) {
  const terminal = vscode.window.createTerminal("ESP32 Flash");
  terminal.show();

  const port = await findEsp32Port();
  const firmware = path.join(ctx.extensionPath, "firmware", "esp32.bin");

  terminal.sendText(`echo "Flashing ESP32 on ${port}"`);
  terminal.sendText(`esptool.py --chip esp32 erase_flash`);
  terminal.sendText(
    `esptool.py --chip esp32 --port ${port} --baud 460800 write_flash -z 0x1000 ${firmware}`
  );

  vscode.window.showInformationMessage("ESP32 Flash gestartet");
}
