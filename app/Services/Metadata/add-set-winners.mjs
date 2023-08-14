import fs from 'fs'

const set = '011'

const metadata = JSON.parse(fs.readFileSync('metadata.json').toString())
const winners = JSON.parse(fs.readFileSync(`../../../drops/sets/results/${set}.json`).toString())

const pad = (num = 0, size = 3) => {
  let padded = num?.toString() || '0'
  while (padded.length < size) padded = '0' + padded
  return padded
}

Object.keys(winners).forEach(edition => {
  winners[edition].forEach((token, idx) => {
    metadata.tokens[token] = `set_${set}-${pad(edition, 2)}`
  })
})

fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))
