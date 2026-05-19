import { readFileSync, writeFileSync } from 'node:fs'

const entryPath = 'dist/index.js'
const banner = 'import "./style.css";\n'
const content = readFileSync(entryPath, 'utf8')

if (!content.includes('./style.css')) {
  writeFileSync(entryPath, banner + content)
}
