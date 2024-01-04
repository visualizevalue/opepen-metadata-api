import puppeteer, { Browser } from 'puppeteer'
import Logger from '@ioc:Adonis/Core/Logger'

let browser: Browser

export const newBrowser = async () => {
  Logger.debug(`Loading new browser`)
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--single-process', '--no-zygote', '--no-sandbox', '--disable-setuid-sandbox'],
  })
  Logger.debug(`New browser loaded`)
}

export const getBrowser = async () => {
  Logger.debug(`Getting browser`)
  if (! browser) {
    await newBrowser()
  }

  return browser
}

export const renderPage = async (url: string, dimension: number = 960) => {
  Logger.debug(`Trying to render page (${url})`)
  const browser = await getBrowser()
  const page = await browser.newPage()

  await page.setViewport({width: dimension, height: dimension})
  await page.goto(url)
  try {
    await page.waitForFunction("RENDERED === true", {
      timeout: 1000,
    })
    Logger.debug(`Rendered page (${url})`)
  } catch (e) {}

  const image = await page.screenshot({});
  Logger.debug(`Screenshot captured (${url})`)

  await page.close()
  Logger.debug(`Page closed (${url})`)

  return image
}
