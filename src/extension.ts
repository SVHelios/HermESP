// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hermesp" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('hermesp.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from HermESP!');
	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "HermESPMainView",
      new HelloWebviewViewProvider(context)
    )
  );


}

// This method is called when your extension is deactivated
export function deactivate() {}


class HelloWebviewViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.getHtml();
  }

  private getHtml(): string {
    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <body>
        <h1>HermESP</h1>
        <p>Wähle hier aus, was Du tun möchtest.</p>
      </body>
      </html>
    `;
  }
}