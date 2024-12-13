import * as puppeteer from 'puppeteer';

export async function convertHtmlToPdf(html) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load", timeout: 0 });
  const uintArray = await page.pdf({
    format: "A4",
    printBackground: true,
    timeout: 0,
  });
  const base64 = Buffer.from(uintArray).toString("base64");
  
  await browser.close();

  return base64;
}
