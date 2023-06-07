import fs from 'fs'
import { pad } from './helpers.mjs'

const SET = process.argv[2]

const config = JSON.parse(fs.readFileSync(`sets/${SET}.json`).toString())
const metadata = JSON.parse(fs.readFileSync('metadata.json').toString())
const winners = JSON.parse(fs.readFileSync(`../../../drops/sets/results/${SET}.json`).toString())

Object.keys(config.sets).forEach(edition => {
  winners[edition].forEach((token, idx) => {
    metadata.tokens[token] = `set_${SET}-${pad(edition, 2)}_${pad(idx + 1, 2)}`
  })
})

fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))
