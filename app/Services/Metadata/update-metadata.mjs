import fs from 'fs'
import winners1 from './set-winners/001.json' assert { type: 'json' }
import winners2 from './set-winners/002.json' assert { type: 'json' }
import metadata from './metadata.json' assert { type: 'json' }

const pad = (num = 0, size = 2) => {
  let padded = num?.toString() || '0'
  while (padded.length < size) padded = '0' + padded
  return padded
}

for (const edition in winners1) {
  const tokens = winners1[edition]

  let editionId = 1
  for (const token of tokens) {
    metadata.tokens[token] = `set_001-${pad(edition)}_${pad(editionId)}`

    editionId++
  }
}

for (const edition in winners2) {
  const tokens = winners2[edition]

  for (const token of tokens) {
    metadata.tokens[token] = `set_002-${pad(edition)}`
  }
}


fs.writeFileSync(`metadata.json`, JSON.stringify(metadata, null, 2))
