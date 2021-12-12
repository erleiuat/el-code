import Defaults from '../defaults'

export default async (d: Defaults) => {

  const selStart = d.lineFromPos(d.sel.start())
  const selEnd = d.lineFromPos(d.sel.end())
  let cmmd = { in: '/*', out: '*/', singleIn: '//', singleOut: '' }

  if (d.lang() === 'python')
    cmmd = { in: '"""', out: '"""', singleIn: '#', singleOut: '' }

  else if (d.lang() === 'twig')
    cmmd = { in: '{#', out: '#}', singleIn: '{#', singleOut: '#}' }

  for (let l = selStart.line; l < (selEnd.line + 1); l++) {
    const cLine = d.lineFromPos(d.vsPos(l, 0))

    if (!cLine.text.trim().startsWith(cmmd.singleIn))
      await cLine.replace(
        `${ ' '.repeat(cLine.indent) }${ cmmd.singleIn } `
        + `${ cLine.text.trim() }`
        + `${ cmmd.singleOut.length ? `\t${ cmmd.singleOut }` : '' }`
        + `${ l === selStart.line || l === selEnd.line ? `\t${ d.icon }` : '' }`
      )

    else
      await cLine.replace(
        `${ ' '.repeat(cLine.indent) }`
        + `${ (cmmd.singleOut.length > 0 ? cLine.text.replace(cmmd.singleOut, '') : cLine.text)
          .replace(cmmd.singleIn, '')
          .replace(d.iconRegex, '')
          .trim() }`
      )

  }

}
