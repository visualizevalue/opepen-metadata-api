import fs from 'fs'
import CONFIG from './sets/011.json' assert { type: 'json' }

const editions = {
  "1": "One",
  "4": "Four",
  "5": "Five",
  "10": "Ten",
  "20": "Twenty",
  "40": "Forty",
}

const pad = (num = 0, size = 3) => {
  let padded = num?.toString() || '0'
  while (padded.length < size) padded = '0' + padded
  return padded
}

const metadata = JSON.parse(fs.readFileSync('metadata.json').toString())

Object.keys(CONFIG.sets).forEach(edition => {
  CONFIG.sets[edition].forEach((file, idx) => {
    metadata.editions[`set_${CONFIG.set}-${pad(edition, 2)}_${pad(idx + 1, 2)}`] = {
      "image": `ipfs://${CONFIG.hash}/${file}`,
      "attributes": [
        {
          "trait_type": "Artist",
          "value": CONFIG.artist,
        },
        {
          "trait_type": "Release",
          "value": CONFIG.release,
        },
        {
          "trait_type": "Set",
          "value": CONFIG.set,
        },
        {
          "trait_type": "Opepen",
          "value": CONFIG.names[edition]
        },
        {
          "trait_type": "Edition Size",
          "value": editions[edition]
        }
      ]
    }
  })
})

fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2))
