TypeScript Puppeteer Goto Same Route Demo
=========================================

If puppeteer goto the same route, the DOM is not changed,
we have to use `page.reload` to refresh it.

Start react app:

```
cd react-app
npm install
npm run demo
```

Back to the demo root, then start puppeteer code:

```
npm install -g puppeteer
npm run demo
```

Note: since puppeteer needs to download a very huge Chrome which makes the installation quite slow,
I prefer install puppeteer globally and reuse it in all my puppeteer demos.
