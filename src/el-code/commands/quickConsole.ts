import Defaults from '../defaults'
const path = require('path')

export default async (d: Defaults) => {
  if (!d.doc || !d.editor) return

  const file = path.basename(d.doc.fileName)
  const aLine = d.sel.active()
  const aLineLength = d.doc.lineAt(aLine.line).text.length
  const aLineEnd = d.vsPos(aLine.line, aLineLength)
  const aLineChars = d.doc.lineAt(aLine.line).text.trim().length > 0
  const selection
    = d.doc.getText(d.editor.selection).trim().replace('$', '\\$')
    || `'| --- ${ aLine.line + (aLineChars ? 2 : 1) } --- |'` || ''

  let msg = ''

  switch (d.lang()) {

    case 'python':
      msg = `print('${ d.icon }|${ file }|', ${ selection })`
      break
    case 'php':
      msg = `echo '${ d.icon }|${ file }|', ${ selection };`
      break
    case 'twig':
      msg = `<br/>${ d.icon }<br/><pre>{{ dump(${ selection }) }}</pre>`
      break
    default:
      msg = `console.log('${ d.icon }|${ file }|', ${ selection })`
      break

  }

  d.editor.selections = [ d.vsSel(aLineEnd, aLineEnd) ]
  await d.insertSnippet(`${ aLineChars ? '\n' : '' }${ msg }`)

  const nLine = d.sel.active().line
  const nlineLength = d.doc.lineAt(nLine).text.length
  const cPos1 = d.vsPos(nLine, nlineLength - selection.length - 1)
  const cPos2 = d.vsPos(nLine, nlineLength - 1)

  if (d.editor) d.editor.selections = [ d.vsSel(cPos1, cPos2) ]

}
