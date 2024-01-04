import puppeteer, { Browser } from 'puppeteer'
import Logger from '@ioc:Adonis/Core/Logger'

let browser: Browser

export const newBrowser = async () => {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}

export const getBrowser = async () => {
  if (! browser) {
    await newBrowser()
  }

  return browser
}

export const renderPage = async (url: string, dimension: number = 960) => {
  try {
    const browser = await getBrowser()
    const page = await browser.newPage()

    await page.setViewport({width: dimension, height: dimension})
    await page.goto(url)
    try {
      await page.waitForFunction("RENDERED === true", {
        timeout: 1000,
      })
    } catch (e) {}

    const image = await page.screenshot({});
    Logger.debug('Screenshot captured')

    await page.close()
    Logger.debug('Page closed')

    return image
  } catch (e) {
    if (browser) {
      await browser.close()

      await newBrowser()
    }

    return await renderPage(url, dimension)
  }
}
