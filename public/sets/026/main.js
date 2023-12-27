import OpepenCharacters from './opepen-characters.js'

// HTML Elements
const opepenElement     = document.getElementById('opepen')
const charactersElement = document.getElementById('characters')
const formElement       = document.getElementById('input-form')
const inputElement      = document.getElementById('input')

// Grab our config from the URL
const config  = new URLSearchParams(window.location.search)
const edition = parseInt(config.get('edition'))
const id      = parseInt(config.get('id'))

new OpepenCharacters({
  opepenElement,
  charactersElement,
  formElement,
  inputElement,
  edition,
  id,
})
