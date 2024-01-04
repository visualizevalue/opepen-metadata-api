import CONFIG from './VV0-CONFIG.js'

const LETTERS = {
  ...CONFIG.LETTERS,
  ' ': ``,
}

const LETTER_WIDTHS = {
  DEFAULT: 20,
  ' ': 10,
}

Object.entries(CONFIG.LETTER_WITHS).forEach(([letter, width]) => {
  if (width === '20') return
  LETTER_WIDTHS[letter] = parseInt(width)
})

/**
 * Write some text as SVG VV font.
 *
 * @param {string} text The text you want to write
 * @param {string} color An SVG fill compatible color string
 * @param {number} spacing The space between letters
 * @returns {string} The assembled SVG <g> group
 */
export const vvrite = (text, color = 'currentColor', spacing = 6) => {
  const letters = text.split('')

  let line = `<g fill="${color}" fill-rule="evenodd" clip-rule="evenodd">`
  let letterPos = 0

  for (let letter of letters) {
    const normalized = letter.toUpperCase()
    const path = LETTERS[normalized]
    const width = LETTER_WIDTHS[normalized] || LETTER_WIDTHS.DEFAULT

    if (typeof path === 'undefined') continue

    line += `<g transform="translate(${letterPos})">`
    line += `<path d="${path}" />`
    line += `</g>`

    letterPos = letterPos + width + spacing
  }

  line += `</g>`

  const lineWidth = Math.max(letterPos - spacing, 0)

  return `<svg
  viewBox="0 0 ${lineWidth} 30"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>${line}</svg>`
}
