import { generateSvg } from './opepen-svg.js'
import { vvrite } from './vv0.js'

const container = document.getElementById('opepen')
const config  = new URLSearchParams(window.location.search)
const edition = parseInt(config.get('edition'))
const set = 31

const render = async () => {
  let totals

  try {
    const response = await fetch(`https://api.opepen.art/v1/opepen/sets/${set}/stats/listings`)
    const data = await response.json()

    if (! data.totals) throw Error('Faulty response')

    totals = data.totals
  } catch (e) {
    totals = {
      "1": 1,
      "4": 4,
      "5": 5,
      "10": 10,
      "20": 20,
      "40": 40,
    }
  }

  const bg = edition === 1 ? 'white' : 'black'
  const listingCount = totals[edition]
  const position = 1 - listingCount / edition // 0 - 1
  const hue = 8 + 106 * position // 8 - 114
  const fill = `hsl(${hue}, 100%, 50%)`
  const fillEyes = edition === 1
  const lookingLeft = position < 0.5
  const positionIndicator = edition !== 1
  const dimension = Math.min(window.innerWidth, window.innerHeight)

  container.innerHTML = generateSvg({
    dimension,
    bg,
    fill,
    fillEyes,
    position, // 0 - 1
    lookingLeft,
    positionIndicator,
  }) + vvrite(edition.toString(), fill)

  console.log(`Within Set ${set} Edition ${edition}, there are ${listingCount} Opepen listings (${parseInt((1 - position) * 100)}%)`)

  RENDERED = true
}

render()
