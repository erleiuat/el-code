import * as vs from 'vscode'
import * as elCode from './el-code/el-Code'

export function activate(context: vs.ExtensionContext) {

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

export function deactivate() { }
