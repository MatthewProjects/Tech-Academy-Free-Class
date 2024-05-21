import * as vscode from 'vscode'

export const activate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('codeServerNPM.npm', () => {
      const term = vscode.window.createTerminal('code-server NPM');
      term.sendText('sudo apt update', true);
      term.sendText('sudo apt install build-essential', true); // TODO: Make this a more universal solution
      term.sendText('curl -L https://git.io/n-install | bash', true);
      term.sendText('node -v', true);
      term.sendText('npm -v', true);
      term.dispose();
    })
  )
}
