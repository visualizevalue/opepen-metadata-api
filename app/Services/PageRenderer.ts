import puppeteer, { Browser } from 'puppeteer'
import Logger from '@ioc:Adonis/Core/Logger'

let browser: Browser

export const newBrowser = async () => {
  Logger.info(`Closing browser (if exists)`)
  await browser?.close()

  Logger.info(`Loading new browser`)
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--single-process',
      '--no-zygote',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    protocolTimeout: 10_000,
  })
  Logger.info(`New browser loaded`)
}

export const getBrowser = async () => {
  Logger.info(`Getting browser`)
  if (! browser) {
    await newBrowser()
  }

  return browser
}

export const renderPage = async (url: string, dimension: number = 960, tries: number = 1) => {
  try {
    Logger.info(`Trying to render page (${url}) (try ${tries})`)
    const browser = await getBrowser()
    const page = await browser.newPage()

    await page.setViewport({width: dimension, height: dimension})
    await page.goto(url)
    try {
      await page.waitForFunction("RENDERED === true", {
        timeout: 1000,
      })
      Logger.info(`Rendered page (${url})`)
    } catch (e) {}

    const image = await page.screenshot({});
    Logger.info(`Screenshot captured (${url})`)

    await page.close()
    Logger.info(`Page closed (${url})`)

    return image
  } catch (e) {
    if (tries > 3) {
      await browser?.close()

      throw e
    }

    Logger.info(`Encountered an error – retrying to render (${url})`)

    await newBrowser()

    return await renderPage(url, dimension, tries + 1)
  }
}
