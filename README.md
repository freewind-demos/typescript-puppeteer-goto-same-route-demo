TypeScript Puppeteer Click To Goto Same Url Hash Demo
=====================================================

Even if go to the same url with same hash, puppeteer treats it as
a navigation, so we can use `page.waitForNavigation` to ensure
the operation is complete

```
npm install -g puppeteer
npm run demo
```

Note: since puppeteer needs to download a very huge Chrome which makes the installation quite slow,
I prefer install puppeteer globally and reuse it in all my puppeteer demos.
