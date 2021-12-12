import * as vs from 'vscode'
import Defaults from '../defaults'

export default async (d: Defaults) => {

  const textBefore = d.doc?.getText(d.vsRan(d.vsPos(0, 0), d.active() || d.vsPos(0, 0))) || ''
  const lineActive = d.lineFromPos(d.active())
  const cmmd = {
    singleIn: '//',
    singleOut: '',
    in: '/*',
    out: '*/',
    insert: (textBefore.match(/\/\*/g)?.length === textBefore.match(/\*\//g)?.length)
  }

  if (d.lang === 'python') {
    cmmd.singleIn = '#'
    cmmd.in = '"""'
    cmmd.out = '"""'
    cmmd.insert = (textBefore.match(/"""/g)?.length || 0) % 2 === 0
  } else if (d.lang === 'twig') {
    cmmd.singleIn = '{#'
    cmmd.singleOut = '#}'
    cmmd.in = '{#'
    cmmd.out = '#}'
    cmmd.insert = (textBefore.match(/{#/g)?.length || 0) % 2 === 0
  }

  if (cmmd.insert && !lineActive.text.trim().startsWith(cmmd.singleIn)) {

    if (d.editor?.selection.isSingleLine) {
      await lineActive.replace(`${' '.repeat(lineActive.indent)}${cmmd.singleIn} ${lineActive.text.trim()}\t${d.icon}\t${cmmd.singleOut}`)
    } else {

      const lineIn = d.lineFromPos(d.editor?.selection.start)
      const lineOut = d.lineFromPos(d.editor?.selection.end)
      await d.insert(
        [lineIn.start, `${' '.repeat(lineIn.indent)}${cmmd.in}\t${d.icon}\n`],
        [lineOut.end, `\n${' '.repeat(lineOut.indent)}\t\t${d.icon}\t${cmmd.out}`]
      )

    }

    if (!d.editor) return
    const lineEnd = d.lineFromPos(d.editor?.selection.start)
    d.editor.selections = [d.vsSel(lineEnd.end, lineEnd.end)]

  } else if (lineActive.text.trim().startsWith(cmmd.singleIn)) {

    const repl = cmmd.singleOut.length > 0 ? lineActive.text.replace(`${cmmd.singleOut}`, '') : lineActive.text
    await lineActive.replace(`${' '.repeat(lineActive.indent)}${repl.replace(`${cmmd.singleIn}`, '').replace(d.iconRegex, '').trim()}`)

  } else {

    let removeIn = d.active().line || 0
    let removeOut = d.active().line || 0

    while (
      !d.doc?.lineAt(removeIn).text.replace(d.iconRegex, '').trim().startsWith(cmmd.in) &&
      removeIn >= 0
    ) removeIn--

    while (
      !d.doc?.lineAt(removeOut).text.replace(d.iconRegex, '').trim().startsWith(cmmd.out) &&
      (d.doc?.lineCount || 0) >= removeOut
    ) removeOut++

    const cInText = d.doc?.lineAt(removeIn).text.replace(cmmd.in, '').replace(d.iconRegex, '') || ''
    const cOutText = d.doc?.lineAt(removeOut).text.replace(cmmd.out, '').replace(d.iconRegex, '') || ''

    if (cOutText.trim().length <= 0 && removeOut > 0)
      await d.remove([d.vsPos(removeOut - 1, d.doc?.lineAt(removeOut - 1).text.length || 0), d.vsPos(removeOut, d.doc?.lineAt(removeOut).text.length || 0)])
    else
      await d.replace([d.vsRan(d.vsPos(removeOut, 0), d.vsPos(removeOut, d.doc?.lineAt(removeOut).text.length || 0)), cOutText])

    if (cInText.trim().length <= 0 && removeIn > 0)
      await d.remove([d.vsPos(removeIn - 1, d.doc?.lineAt(removeIn - 1).text.length || 0), d.vsPos(removeIn, d.doc?.lineAt(removeIn).text.length || 0)])
    else
      await d.replace([d.vsRan(d.vsPos(removeIn, 0), d.vsPos(removeIn, d.doc?.lineAt(removeIn).text.length || 0)), cInText])


  }

}
