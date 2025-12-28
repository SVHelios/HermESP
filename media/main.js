const vscode = acquireVsCodeApi();

window.addEventListener('DOMContentLoaded', () => {
  const messageArea = document.getElementById('messageArea');

  function showMessage(text) {
    messageArea.textContent = text;
    messageArea.style.opacity = '1';

    setTimeout(() => {
      messageArea.style.opacity = '0';
    }, 3000);
  }

  document
    .getElementById('transferProgramButton')
    .addEventListener('click', () => {
      showMessage('Transferring file...');
      vscode.postMessage({ command: 'hermesp.transferFile' });
    });

  document
    .getElementById('flashEspButton')
    .addEventListener('click', () => {
      showMessage('Flashing MCU...');
      vscode.postMessage({ command: 'hermesp.flashMcu' });
    });
});
