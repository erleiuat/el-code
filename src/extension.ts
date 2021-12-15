import * as elCode from './el-code/el-code'
import * as vs from 'vscode'

export function activate (context: vs.ExtensionContext) {

  context.subscriptions.push(
    vs.commands.registerCommand(
      'el-code.quickConsole',
      elCode.quickConsole
    )
  )
  context.subscriptions.push(
    vs.commands.registerCommand(
      'el-code.commentSelection',
      elCode.commentSelection
    )
  )

}

export function deactivate () { }
