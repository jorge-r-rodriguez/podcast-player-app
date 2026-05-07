import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const distDirectory = resolve(process.cwd(), 'dist')

await copyFile(resolve(distDirectory, 'index.html'), resolve(distDirectory, '404.html'))
