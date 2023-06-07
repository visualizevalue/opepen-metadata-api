import fs from 'fs'
import { pad } from './helpers.mjs'

const SET = process.argv[2]
const EDITIONS = {
  "1": "One",
  "4": "Four",
  "5": "Five",
  "10": "Ten",
  "20": "Twenty",
  "40": "Forty",
}

const config = JSON.parse(fs.readFileSync(`sets/${SET}.json`).toString())
const metadata = JSON.parse(fs.readFileSync('metadata.json').toString())

Object.keys(config.sets).forEach(edition => {
  config.sets[edition].forEach((file, idx) => {
    metadata.editions[`set_${SET}-${pad(edition, 2)}_${pad(idx + 1, 2)}`] = {
      "image": `ipfs://${config.hash}/${file}`,
      "attributes": [
        {
          "trait_type": "Artist",
          "value": config.artist
        },
        {
          "trait_type": "Release",
          "value": config.release
        },
        {
          "trait_type": "Set",
          "value": config.set
        },
        {
          "trait_type": "Opepen",
          "value": config.names[edition]
        },
        {
          "trait_type": "Edition Size",
          "value": EDITIONS[edition]
        }
      ]
    }
  })
})

fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))
