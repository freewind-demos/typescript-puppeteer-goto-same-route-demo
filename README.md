TypeScript Puppeteer Click To New Page and Wait For Navigation Demo
===================================================================

We often have such a scenario:

1. click a link on page
2. browser redirects to a new page
3. we do some checking, e.g. url is correct

It's natural to write such incorrect code with puppeteer:

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

## What if no real page redirection for the click?

In single page application, when we click on a link, only hash of url changes, in this case, browse will not load
a new page, so there will no ``

```
npm install -g puppeteer
npm run demo
```

Note: since puppeteer needs to download a very huge Chrome which makes the installation quite slow,
I prefer install puppeteer globally and link it to this project before running.
