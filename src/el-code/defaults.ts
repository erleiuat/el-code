import * as vs from 'vscode'

const icon = '🦄'
const editor = () => vs.window.activeTextEditor
const doc = () => editor()?.document
const vsPos = (line: number, char: number) => new vs.Position(line, char)
const vsSel = (anchor: vs.Position, active: vs.Position) => new vs.Selection(anchor, active)
const vsRan = (start: vs.Position, end: vs.Position) => new vs.Range(start, end)

const replace = async (...items: [range: vs.Range, text: string][]) =>
  await editor()?.edit(e => items.forEach(elem => e.replace(elem[0], elem[1]))) || false

const insert = async (...items: [pos: vs.Position, text: string][]) =>
  await editor()?.edit(e => items.forEach(elem => e.insert(elem[0], elem[1]))) || false

const remove = async (...items: [pos1: vs.Position, pos2: vs.Position][]) =>
  await editor()?.edit(e => items.forEach(elem => e.delete(vsRan(elem[0], elem[1])))) || false

class Line {

  pos: vs.Position | null = null
  line: number = 0
  text: string = ''
  range: vs.Range
  start: vs.Position
  end: vs.Position
  indent: number = 0
  replace: (text: string) => Promise<boolean>

  constructor (pos: vs.Position = vsPos(0, 0)) {

    try {
      this.text = doc()?.lineAt(pos.line).text || ''
    } catch (e) {
      console.log(e)
    }

    this.pos = pos
    this.line = this.pos.line
    this.start = vsPos(this.pos.line, 0)
    this.end = vsPos(this.pos.line, this.text.length) || 0
    this.range = vsRan(this.start, this.end)
    this.indent = this.text.length - this.text.trimLeft().length || 0
    this.replace = async (text: string) => await replace([ this.range, text ])

  }

}
export default class Defaults {

  vs: object = vs
  icon: string = icon
  editor: vs.TextEditor | undefined = editor()
  doc: vs.TextDocument | undefined = doc()
  iconRegex: RegExp = new RegExp(icon, 'g')
  lang = () => doc()?.languageId.toLowerCase() || ''
  vsPos = vsPos
  vsSel = vsSel
  vsRan = vsRan
  replace = replace
  insert = insert
  remove = remove
  insertSnippet = async (content: string) => await editor()?.insertSnippet(new vs.SnippetString(content))
  lineFromPos = (pos: vs.Position | undefined) => new Line(pos)
  sel = {
    active : () => editor()?.selection.active || vsPos(0, 0),
    anchor : () => editor()?.selection.anchor || vsPos(0, 0),
    end    : () => editor()?.selection.end || vsPos(0, 0),
    start  : () => editor()?.selection.start || vsPos(0, 0),
  }

}
