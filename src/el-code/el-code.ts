import qs from './commands/quickConsole'
import cs from './commands/commentSelection'
import Defaults from './defaults'

const commentSelection = () => {
  try {
    const def = new Defaults
    if (!def.editor) return
    cs(def)
  } catch (e) {
    console.log(e)
  }
}

const quickConsole = () => {
  try {
    const def = new Defaults
    if (!def.editor) return
    qs(def)
  } catch (e) {
    console.log(e)
  }
}

export { commentSelection, quickConsole }