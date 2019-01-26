import * as puppeteer from 'puppeteer';
import {Page} from 'puppeteer';

async function setupMocks(page: Page) {
  await page.setRequestInterception(true);
  await page.on('request', async (request) => {
    const url = request.url();
    console.log('url: ', url);
    if (url === 'http://localhost/page1') {
      await request.respond({
        status: 200,
        body: '<a id=\'link\' href="http://localhost/page2">to page2</a>'
      })
    } else {
      await request.abort();
    }
  })
}

async function gotoUrl(page: Page, url: string) {
  await Promise.all([
    page.goto(url),
    page.waitForNavigation({waitUntil: 'domcontentloaded'})
  ])
}

async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = (await page.$(selector))!
  const textContent = await element.getProperty('textContent')
  return await textContent.jsonValue() as string
}

async function run() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(1000);

  await gotoUrl(page, "http://localhost:8789/#/counter?_k=4stpzp");

  await page.click('#button')
  const count = await getTextContent(page, '#counter')
  console.log('count should be 1: ', count)

  await gotoUrl(page, "http://localhost:8789/#/counter?_k=4stpzp");
  const count2 = await getTextContent(page, '#counter')
  console.log('count should be 1: ', count2)

  await page.reload({waitUntil: 'domcontentloaded'})
  const count3 = await getTextContent(page, '#counter')
  console.log('count should be 0: ', count3)

  await browser.close();
}

run();
