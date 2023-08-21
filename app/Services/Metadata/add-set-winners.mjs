import fs from 'fs'

// TODO: Refactor into /commands
const SET = process.argv[2]
const DYNAMIC = process.argv[3] === 'dynamic' ? true : false

const metadata = JSON.parse(fs.readFileSync('metadata.json').toString())
const winners = JSON.parse(fs.readFileSync(`../../../drops/sets/results/${SET}.json`).toString())

const pad = (num = 0, size = 3) => {
  let padded = num?.toString() || '0'
  while (padded.length < size) padded = '0' + padded
  return padded
}

Object.keys(winners).forEach(edition => {
  winners[edition].forEach((token, idx) => {
    let key = `set_${SET}-${pad(edition, 2)}`
    if (DYNAMIC) key += `_${pad(idx + 1, 2)}`

    metadata.tokens[token] = key
  })
})

fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))
