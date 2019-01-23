TypeScript Puppeteer Click To New Page and Wait For Navigation Demo
===================================================================

We often have such a scenario:

1. click a link on page
2. browser redirects to a new page
3. we do some checking, e.g. new url is correct

It's natural to write such code with puppeteer:

```
await page.click('.someLinkToNewPage');
await page.waitForNavigation({waitUntil: 'domcontentloaded'});
```

or:

```
await page.click('.someLinkToNewPage');
await page.waitForNavigation({waitUntil: 'networkidle0'}); // networkidle2
```

The are incorrect since they are not stable, which depends on the network speed, or content size of the new page.

If the new page is small and fast enough, there may be in such a condition:

when `await page.click('.someLinkToNewPage')` resolves, the new page has already loaded,
and the later `page.waitForNavigation` will never have a chance to get the expected
`domcontentloaded` or `networkidle0` since they are already fired and missed.

So the correct way is:

```
const navigation = page.waitForNavigation({waitUntil: 'domcontentloaded'});
await page.click('.someLinkToNewPage');
await navigation;
```

or in a clearer format:

```
await Promise.all([
  page.click('.someLinkToNewPage'),
  page.waitForNavigation({waitUntil: 'domcontentloaded'}),
])
```

Please notice in `Promise.all` version, we should not put `await` to `page.click` and `page.waitForNavigation`,
otherwise, `page.waitForNavigation` still waits for `page.click` resolves.

You can find more discussion here: <https://github.com/GoogleChrome/puppeteer/issues/1412#issuecomment-345357063>

## What if url hash changes, but no real requests send?

This is a tricky case.

When only hash changes, e.g. `url#a` -> `url#b`, browser will not send real requests if
we don't have manual AJAX code, so there is no `DOMContentLoaded` or `load` or network activity.
But puppeteer treat it as a navigation, and we can use `page.waitForNavigation` with all provided `waitUntil` events.

See this demo: <https://github.com/freewind-demos/typescript-puppeteer-wait-for-navigation-with-url-hash-change-demo>

## What if DOM updated by AJAX request, but url and hash not changed?

In this case, puppeteer doesn't treat it as a 'navigation', so we can't use `page.waitForNavigation`.

Instead, we should use `page.waitForSelector` or `page.waitForFunction` to check the expected DOM.

## Run this demo

```
npm install -g puppeteer
npm run demo
```

Note: since puppeteer needs to download a very huge Chrome which makes the installation quite slow,
I prefer install puppeteer globally and reuse it in all my puppeteer demos.
