const path = require('path')
import Defaults from '../defaults'

export default async (d: Defaults) => {

  const file = path.basename(d.doc?.fileName)
  const alineLength = d.doc?.lineAt(d.active().line).text.length || 0
  const alineChars = d.doc?.lineAt(d.active().line).text.trim().length || 0
  const alineEnd = d.vsPos(d.active().line, alineLength)

  const selection =
    d.doc?.getText(d.editor?.selection).trim().replace('$', '\\$') ||
    `'| --- ${(d.editor?.selection.active.line || 0) +
    (alineChars > 0 ? 2 : 1)} --- |'` || ''

  let msg = ''

  if (d.lang === 'python')
    msg = `print('${d.icon}|${file}|', ${selection})`
  else if (d.lang === 'php')
    msg = `echo '${d.icon}|${file}|', ${selection};`
  else if (d.lang === 'twig')
    msg = `<br/>${d.icon}<br/><pre>{{ dump(${selection}) }}</pre>`
  else
    msg = `console.log('${d.icon}|${file}|', ${selection})`

    
  if (!d.editor) return
  d.editor.selections = [d.vsSel(alineEnd, alineEnd)]

  await d.insertSnippet(`${alineChars > 0 ? '\n' : ''}${msg}`)

  const nLine = d.active().line
  const nlineLength = d.doc?.lineAt(nLine).text.length || 0
  const cPos1 = d.vsPos(nLine, (nlineLength - selection.length - 1))
  const cPos2 = d.vsPos(nLine, (nlineLength - 1))
  if (d.editor) d.editor.selections = [d.vsSel(cPos1, cPos2)]

}
