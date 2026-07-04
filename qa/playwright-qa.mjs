import { chromium } from "playwright";

const url = "http://127.0.0.1:3000";
const executablePath = "C:/Users/Faiz/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    await Promise.race([
      Promise.all(
        Array.from(document.images).map((img) =>
          img.complete
            ? null
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              })
        )
      ),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);

    const height = document.documentElement.scrollHeight;
    for (let y = 0; y <= height; y += 900) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1400);
}

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath });

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1400 },
    deviceScaleFactor: 1,
  });
  const page = await desktop.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await settle(page);

  await page.screenshot({ path: "qa/desktop-full.png", fullPage: true, animations: "disabled", timeout: 90000 });
  const initial = await page.evaluate(() => ({
    title: document.title,
    innerWidth,
    innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    canScrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    serviceCards: document.querySelectorAll(".service-card").length,
    workCards: document.querySelectorAll(".work-card").length,
    priceCards: document.querySelectorAll(".price-card").length,
    faqItems: document.querySelectorAll(".faq-item").length,
  }));

  await page.locator(".faq-item").nth(2).locator("button").click();
  await page.waitForTimeout(450);
  const faqState = await page.evaluate(() => ({
    expanded: document.querySelectorAll(".faq-item")[2].querySelector("button").getAttribute("aria-expanded"),
    text: document.querySelectorAll(".faq-item")[2].querySelector(".faq-answer p").innerText,
  }));
  await page.screenshot({ path: "qa/desktop-faq-open.png", animations: "disabled", timeout: 45000 });

  await page.locator('a[href="#pricing"]').first().click();
  await page.waitForTimeout(800);
  const anchorState = await page.evaluate(() => ({
    hash: location.hash,
    pricingTop: Math.round(document.querySelector("#pricing").getBoundingClientRect().top),
  }));
  await page.screenshot({ path: "qa/desktop-pricing-anchor.png", animations: "disabled", timeout: 45000 });
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await settle(mobilePage);
  await mobilePage.screenshot({ path: "qa/mobile-full.png", fullPage: true, animations: "disabled", timeout: 90000 });
  await mobilePage.locator(".menu-button").tap();
  await mobilePage.waitForTimeout(300);
  const mobileState = await mobilePage.evaluate(() => ({
    canScrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    navOpen: document.querySelector("header nav").classList.contains("open"),
    menuRect: document.querySelector("header nav").getBoundingClientRect().toJSON(),
  }));
  await mobilePage.screenshot({ path: "qa/mobile-menu-open.png", animations: "disabled", timeout: 45000 });
  await mobile.close();

  await browser.close();

  console.log(JSON.stringify({ initial, faqState, anchorState, mobileState }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
