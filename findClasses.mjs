import { chromium } from '@playwright/test';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // wait for hydration and render
  const el1 = await page.$('.css-1p365vr');
  const el2 = await page.$('.css-1yhk9ts');
  console.log('css-1p365vr:', el1 ? await el1.evaluate(e => e.outerHTML.substring(0, 300)) : 'not found');
  console.log('css-1yhk9ts:', el2 ? await el2.evaluate(e => e.outerHTML.substring(0, 300)) : 'not found');
  await browser.close();
})();
