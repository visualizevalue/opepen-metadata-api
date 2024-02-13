import fs from 'fs'
import data from './030.json'

const computed: {[key: string]: {
  signer: string,
  holder: string,
  total: number,
  edition1: number,
  edition4: number,
  edition5: number,
  edition10: number,
  edition20: number,
  edition40: number,
  edition1MaxReveal: number|string,
  edition4MaxReveal: number|string,
  edition5MaxReveal: number|string,
  edition10MaxReveal: number|string,
  edition20MaxReveal: number|string,
  edition40MaxReveal: number|string,
}} = {}

for (const opepen of data.opepens) {
  if (! computed[opepen.signer]) {
    computed[opepen.signer] = {
      signer: opepen.signer,
      holder: opepen.holder,
      total: 0,
      edition1: 0,
      edition4: 0,
      edition5: 0,
      edition10: 0,
      edition20: 0,
      edition40: 0,
      edition1MaxReveal: 'all',
      edition4MaxReveal: 'all',
      edition5MaxReveal: 'all',
      edition10MaxReveal: 'all',
      edition20MaxReveal: 'all',
      edition40MaxReveal: 'all',
    }
  }

  computed[opepen.signer].total ++
  computed[opepen.signer][`edition${opepen.edition}`] ++
  if (data.maxReveals[opepen.signer]) {
    computed[opepen.signer][`edition${opepen.edition}MaxReveal`] = data.maxReveals[opepen.signer][opepen.edition]
  }
}

const csv = [
  `signer, holder, total, edition1, edition4, edition5, edition10, edition20, edition40, edition1MaxReveal, edition4MaxReveal, edition5MaxReveal, edition10MaxReveal, edition20MaxReveal, edition40MaxReveal`
]

Object.values(computed).forEach(({
  signer,
  holder,
  total,
  edition1,
  edition4,
  edition5,
  edition10,
  edition20,
  edition40,
  edition1MaxReveal,
  edition4MaxReveal,
  edition5MaxReveal,
  edition10MaxReveal,
  edition20MaxReveal,
  edition40MaxReveal,
}) => csv.push([
  signer,
  holder,
  total,
  edition1,
  edition4,
  edition5,
  edition10,
  edition20,
  edition40,
  edition1MaxReveal,
  edition4MaxReveal,
  edition5MaxReveal,
  edition10MaxReveal,
  edition20MaxReveal,
  edition40MaxReveal,
].join(', ')))

fs.writeFileSync('./30.csv', csv.join(`\n`))
