import * as vs from 'vscode'

const icon = '🦄'
const editor = vs.window.activeTextEditor
const doc = editor?.document
const vsPos = (line: number, char: number) => new vs.Position(line, char)
const vsSel = (anchor: vs.Position, active: vs.Position) => new vs.Selection(anchor, active)
const vsRan = (start: vs.Position, end: vs.Position) => new vs.Range(start, end)

const replace = async (...items: [range: vs.Range, text: string][]) => {
  await editor?.edit(e => items.forEach((elem) => e.replace(elem[0], elem[1])))
}

const insert = async (...items: [pos: vs.Position, text: string][]) => {
  await editor?.edit(e => items.forEach((elem) => e.insert(elem[0], elem[1])))
}

class Line {

  pos: vs.Position | null = null
  line: number = 0
  text: string = ''
  range: vs.Range
  start: vs.Position
  end: vs.Position
  indent: number = 0
  replace: (text: string) => Promise<void>

  constructor(pos?: vs.Position) {
    this.pos = pos || vsPos(0, 0)
    this.line = this.pos.line
    this.text = doc?.lineAt(this.pos.line).text || ''
    this.start = vsPos(this.pos.line, 0)
    this.end = vsPos(this.pos.line, this.text.length) || 0
    this.range = vsRan(this.start, this.end)
    this.indent = this.text.length - this.text.trimLeft().length || 0
    this.replace = async (text: string) => await replace([this.range, text])
  }

}


class Defaults {

  vs: object = vs
  icon: string = icon
  editor: vs.TextEditor | null = editor ? editor : null
  doc: vs.TextDocument | undefined = doc
  iconRegex: RegExp = new RegExp(icon, 'g')
  lang: string = doc?.languageId.toLowerCase() || ''
  active = () => editor?.selection.active || vsPos(0, 0)
  vsPos = vsPos
  vsSel = vsSel
  vsRan = vsRan
  replace = replace
  insert = insert
  insertSnippet = async (content: string) => await editor?.insertSnippet(new vs.SnippetString(content))
  lineFromPos = (pos: vs.Position | undefined) => new Line(pos)

}

export default Defaults