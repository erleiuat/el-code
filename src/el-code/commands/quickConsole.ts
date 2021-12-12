import Defaults from '../defaults'
const path = require('path')

export default async (d: Defaults) => {
  if (!d.doc || !d.editor) return

  let msg = ''
  const file = path.basename(d.doc.fileName)
  const alineLength = d.doc.lineAt(d.sel.active().line).text.length
  const alineEnd = d.vsPos(d.sel.active().line, alineLength)
  const alineChars = d.doc.lineAt(d.sel.active().line).text.trim().length > 0
  const selection
    = d.doc.getText(d.editor.selection).trim().replace('$', '\\$')
    || `'| --- ${ d.editor.selection.active.line + (alineChars ? 2 : 1) } --- |'` || ''

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

  d.editor.selections = [ d.vsSel(alineEnd, alineEnd) ]
  await d.insertSnippet(`${ alineChars ? '\n' : '' }${ msg }`)

  const nLine = d.sel.active().line
  const nlineLength = d.doc.lineAt(nLine).text.length
  const cPos1 = d.vsPos(nLine, nlineLength - selection.length - 1)
  const cPos2 = d.vsPos(nLine, nlineLength - 1)

  if (d.editor) d.editor.selections = [ d.vsSel(cPos1, cPos2) ]

}
