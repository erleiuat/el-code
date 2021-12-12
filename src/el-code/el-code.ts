import qs from './commands/quickConsole'
import cs from './commands/commentSelection'
import Defaults from './defaults'

const commentSelection = () => {
  const def = new Defaults
  if (!def.editor) return
  cs(def)
}

const quickConsole = () => {
  const def = new Defaults
  if (!def.editor) return
  qs(def)
}

export { commentSelection, quickConsole }