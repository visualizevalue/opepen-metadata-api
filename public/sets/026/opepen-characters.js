import { io } from './socket.io.esm.min.js'
import { formatNumber, getWidth } from './helpers.js'
import { vvrite } from './vv0.js'
import WORDS, { LETTER_COUNTS_PER_EDITION, MIN_LETTER_COUNT } from './words.js'

export default class OpepenCharacters {
  // Application State
  stats = {
    total: 0,
    valid: 0,
    seeds: 0,
    clients: 0,
  }
  words = []
  previosWords = []
  edition = 1
  id = 1
  socket = null

  // HTML elements
  opepenElement = null
  formElement   = null
  inputElement  = null
  statsElement  = null

  // Other options
  width = getWidth()

  constructor ({
    charactersElement,
    opepenElement,
    inputElement,
    formElement,
    edition,
    id,
  }) {
    this.charactersElement = charactersElement
    this.opepenElement = opepenElement
    this.inputElement = inputElement
    this.formElement = formElement
    this.uncheckIcon = opepenElement.querySelector('#icon-uncheck')
    this.checkIcon = opepenElement.querySelector('#icon-check')
    this.statsElement = opepenElement.querySelector('#stats')
    this.vvriter = opepenElement.querySelector('#vvriter')

    this.edition = edition
    this.id = id


    this.initialize()
  }

  get empty () {
    return this.words.length === 0
  }

  get lastWord () {
    return this.words.at(-1)
  }

  get maxLetterCount () {
    return LETTER_COUNTS_PER_EDITION[this.edition]
  }

  get letters () {
    const arr = []

    this.words.forEach(word => word.split('').forEach(letter => {
      arr.push(letter)
    }))

    return arr
  }

  initialize () {
    this.charactersElement.className = `edition-${this.edition}`

    // Event listeners
    window.addEventListener('resize', () => this.onResize())
    this.formElement.addEventListener('submit', (e) => this.onWordSubmit(e))
    this.inputElement.addEventListener('input', (e) => this.onInput(e))
    this.inputElement.addEventListener('keydown', (e) => this.onKeyDown(e))
    this.checkIcon.addEventListener('click', () => this.onWordSubmit())
    this.uncheckIcon.addEventListener('click', () => this.clearInput())

    // Initial render...
    this.render()

    // Watch for updates from the API
    this.connect()
  }

  async connect () {
    this.socket = io('wss://api.opepen.art/sets/026', {
      query: {
        edition: this.edition,
        id: this.id,
      },
      transports: ['websocket'],
      withCredentials: true,
      secure: true,
    })

    this.socket.on(`opepen:load:${this.id}`,    (data) => this.setData(data, true))
    this.socket.on(`opepen:updated:${this.id}`, (data) => this.setData(data))
  }

  setData (data, forceSetPrevious = false) {
    if (data.counts) this.stats = data.counts

    this.setWords(data.words, forceSetPrevious)

    RENDERED = true
  }

  setWords (words, forceSetPrevious = false) {
    this.previosWords = forceSetPrevious ? words : [ ...this.words ]
    this.words = words
    this.render()
  }

  onResize () {
    this.width = getWidth()
    this.opepenElement.style.setProperty("--width", this.width + 'px')

    this.render()
  }

  onKeyDown (e) {
    if (e.keyCode === 13) {
      this.onWordSubmit()
    }
  }

  onInput () {
    const input = this.inputElement.value?.toLowerCase()
    const valid = this.validateInput(input)

    if (valid) {
      this.checkIcon.className.baseVal = 'shown success'
      this.uncheckIcon.className.baseVal = ''
    } else if (input) {
      this.checkIcon.className.baseVal = ''
      this.uncheckIcon.className.baseVal = 'shown'
    } else {
      this.checkIcon.className.baseVal = ''
      this.uncheckIcon.className.baseVal = ''
    }

    this.vvriter.innerHTML = vvrite(input)
  }

  onWordSubmit (e) {
    // Don't submit the page via a POST request...
    e?.preventDefault()

    // Get the word from our input element
    const word = this.inputElement.value?.toLowerCase()

    if (word === 'clear') {
      this.clearWords()
      this.clearInput()
      return this.render()
    }

    // FIXME: Implement clientonly mode
    // Clear input if it's invalid
    const valid = this.validateInput(word)
    if (! valid) {
      this.formElement.classList.add('invalid')
      setTimeout(() => this.formElement.classList.remove('invalid'), 1000)
    } else {
      this.formElement.classList.remove('invalid')
    }

    // Notify our server
    this.store(word)

    // Clear our form & rerender
    const clearAfter = valid ? 0 : 1000
    setTimeout(() => {
      this.clearInput()

      // Render the new word...
      this.render()
    }, clearAfter)
  }

  async store (word) {
    return await this.socket.emit(`opepen:word:${this.id}`, word)
  }

  async clearWords () {
    this.words = []
    return await this.socket.emit(`opepen:clear:${this.id}`)
  }

  validateInput (word) {
    // Word is not part of the BIP 39 wordlist, it's not valid
    if (! WORDS.includes(word)) return false

    if (word.length > this.maxLetterCount) return false

    return true
  }

  clearInput () {
    this.inputElement.value = ''
    this.onInput()
  }

  render () {
    // Set dimensions
    this.opepenElement.style.width = this.width + 'px'
    this.opepenElement.style.height = this.width + 'px'

    // Set the stats
    this.statsElement.innerHTML = vvrite([
      `${formatNumber(this.stats.total)} words entered`,
      `${formatNumber(this.stats.valid)} valid words entered`,
      `${formatNumber(this.stats.seeds)} valid seed phrases`,
    ].join(' - '))

    // Clear existing content
    this.charactersElement.innerHTML = ''

    // Adjust the input color
    if (this.empty) {
      this.formElement.classList.add('empty')
    } else {
      this.formElement.classList.remove('empty')
    }

    let dark = true

    // Find existing span elements (if they exist) and fill our default tiles
    let letterElements = this.charactersElement.querySelectorAll('& > span')
    if (letterElements.length !== this.maxLetterCount) {
      Array(this.maxLetterCount).fill('').forEach(() => {
        this.charactersElement.appendChild(document.createElement('span'))
      })
    }
    letterElements = this.charactersElement.querySelectorAll('& > span')

    // Fill letters
    let index = 0
    this.words.forEach((word, wordIndex) => {

      if (word.length > this.maxLetterCount) return

      word.split('').forEach(letter => {
        const el = letterElements[index]

        if (! el) return

        el.innerHTML = vvrite(letter)
        el.className = dark ? 'dark' : 'light'

        if (wordIndex === 0 && JSON.stringify(this.words) !== JSON.stringify(this.previosWords)) {
          el.classList.add('highlight')

          setTimeout(() => el.classList.remove('highlight'), 1000)
        }

        index ++
      })

      dark = !dark
    })
  }

}
