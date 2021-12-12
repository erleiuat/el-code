import Defaults from './defaults'
import cs from './commands/commentSelection'
import qs from './commands/quickConsole'

const commentSelection = () => {
  try {

    const def = new Defaults()
    if (!def.editor) return
    cs(def)

  } catch (e) {
    console.log(e)
  }
}

const quickConsole = () => {
  try {

    const def = new Defaults()
    if (!def.editor) return
    qs(def)

  } catch (e) {
    console.log(e)
  }
}

export { commentSelection, quickConsole }
