import * as puppeteer from 'puppeteer';
import {Page} from "puppeteer";

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
    } else if (url === 'http://localhost/page2') {
      await request.respond({
        status: 200,
        body: 'Page 2'
      })
    } else {
      // This is important for `networkidle0`, since browser may have some background requests
      // like `http://localhost/favicon.ico`, which may break our expectation
      await request.abort();
    }
  })
}

async function correctWayToClickAndWaitForDomContentLoaded1(page: Page) {
  console.log('---------- correctWayToClickAndWaitForDomContentLoaded1 ------------');
  await page.goto("http://localhost/page1");

  await Promise.all([
    page.click('#link'),
    page.waitForNavigation({waitUntil: 'domcontentloaded'}),
  ])
}

async function correctWayToClickAndWaitForDomContentLoaded2(page: Page) {
  console.log('---------- correctWayToClickAndWaitForDomContentLoaded2 ------------');
  await page.goto("http://localhost/page1");

  const navigation = page.waitForNavigation({waitUntil: 'domcontentloaded'})
  await page.click('#link')
  await navigation;
}

async function correctWayToClickAndWaitForNetworkIdle(page: Page) {
  console.log('---------- correctWayToClickAndWaitForNetworkIdle ------------');
  await page.goto("http://localhost/page1");
  await Promise.all([
    page.click('#link'),
    page.waitForNavigation({waitUntil: 'networkidle0'}),
  ])
}

async function wrongWayToClickAndWaitForDirection(page: Page) {
  console.log('---------- wrongWayToClickAndWaitForDirection ------------');
  await page.goto("http://localhost/page1");
  await page.click('#link')
  await page.waitForNavigation({waitUntil: 'domcontentloaded'})
}

async function run() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(1000);

  await setupMocks(page);

  await correctWayToClickAndWaitForDomContentLoaded1(page);
  await correctWayToClickAndWaitForDomContentLoaded2(page);
  await correctWayToClickAndWaitForNetworkIdle(page);

  try {
    await wrongWayToClickAndWaitForDirection(page);
  } catch (e) {
    console.log('## Expected error ##')
    console.error(e);
  }

  await browser.close();
}

run();
