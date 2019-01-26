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

async function gotoSection1(page: Page) {
  console.log('------- gotoSection1 -------')
  await Promise.all([
    page.goto("http://localhost/page1#section1"),
    page.waitForNavigation({waitUntil: 'domcontentloaded'})
  ])
}

async function run() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(1000);

  await setupMocks(page);

  await gotoSection1(page);
  await gotoSection1(page);

  await browser.close();
}

run();
