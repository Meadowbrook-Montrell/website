import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Start preview server
  const server = Bun.spawn(["bunx", "vite", "preview", "--port", "4174"], {
    cwd: import.meta.dir + "/..",
    stdout: "pipe",
    stderr: "pipe",
  });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.goto("http://localhost:4174", { waitUntil: "networkidle" });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Screenshot 1: Hero
  await page.screenshot({ path: "tmp/screenshot-hero.png" });
  console.log("Hero screenshot taken");
  
  // Scroll to about section
  await page.evaluate(() => document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.screenshot({ path: "tmp/screenshot-about.png" });
  console.log("About screenshot taken");
  
  // Scroll to podcast section
  await page.evaluate(() => document.querySelector('#podcast')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.screenshot({ path: "tmp/screenshot-podcast.png" });
  console.log("Podcast screenshot taken");
  
  // Scroll to content section
  await page.evaluate(() => document.querySelector('#content')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.screenshot({ path: "tmp/screenshot-content.png" });
  console.log("Content screenshot taken");
  
  // Scroll to merch section
  await page.evaluate(() => document.querySelector('#merch')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.screenshot({ path: "tmp/screenshot-merch.png" });
  console.log("Merch screenshot taken");
  
  // Scroll to connect/footer
  await page.evaluate(() => document.querySelector('#connect')?.scrollIntoView({ behavior: 'instant' }));
  await new Promise(resolve => setTimeout(resolve, 1500));
  await page.screenshot({ path: "tmp/screenshot-connect.png" });
  console.log("Connect screenshot taken");
  
  await browser.close();
  server.kill();
  console.log("Done!");
}

main().catch(e => { console.error(e); process.exit(1); });
