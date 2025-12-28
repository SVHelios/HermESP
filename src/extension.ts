import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('HermESP Extension activated');

  // ------------------------
  // Commands
  // ------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand('hermesp.flashMcu', () => {
      vscode.window.showInformationMessage('Flashing MCU...');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('hermesp.transferFile', () => {
      vscode.window.showInformationMessage('Transferring file...');
    })
  );

  // ------------------------
  // Webview View
  // ------------------------
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'HermESPMainView',
      new HermESPViewProvider(context),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );
}

export function deactivate() {}

class HermESPViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(view: vscode.WebviewView) {
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'media')
      ]
    };

    // Webview → Extension
    view.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'hermesp.transferFile':
          vscode.commands.executeCommand('hermesp.transferFile');
          break;
        case 'hermesp.flashMcu':
          vscode.commands.executeCommand('hermesp.flashMcu');
          break;
      }
    });

    view.webview.html = this.getHtml(view.webview);
  }

  private getHtml(webview: vscode.Webview): string {
    const media = vscode.Uri.joinPath(this.context.extensionUri, 'media');

    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(media, 'styling.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(media, 'main.js'));
    const transferSvg = webview.asWebviewUri(vscode.Uri.joinPath(media, 'uebertragen.svg'));
    const flashSvg = webview.asWebviewUri(vscode.Uri.joinPath(media, 'flashing.svg'));

    const nonce = getNonce();

    return /* html */ `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">

  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    style-src ${webview.cspSource};
    img-src ${webview.cspSource};
    script-src 'nonce-${nonce}';
  ">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${styleUri}" rel="stylesheet">

  <title>HermESP</title>
</head>

<body>
  <h1>HermESP</h1>
  <p>Wähle hier aus, was Du tun möchtest.</p>

  <h2>Programm übertragen</h2>
  <button id="transferProgramButton" class="vscode-button gruen">
    <img src="${transferSvg}" class="icon">
    Übertragen
  </button>

  <h2>ESP flashen</h2>
  <button id="flashEspButton" class="vscode-button rot">
    <img src="${flashSvg}" class="icon">
    Flashen
  </button>

  <div id="messageArea"></div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>
    `;
  }
}

// ------------------------
// Helper
// ------------------------
function getNonce() {
  return Math.random().toString(36).substring(2, 15);
}
