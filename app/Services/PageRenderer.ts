import puppeteer, { Browser } from "puppeteer"

let browser: Browser

export const getBrowser = async () => {
  if (! browser) {
    browser = await puppeteer.launch({ headless: 'new' })
  }

  return browser
}