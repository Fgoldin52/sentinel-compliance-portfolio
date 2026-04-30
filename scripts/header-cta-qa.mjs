import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/sentinel-mobile-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

const widths = [375, 639, 640, 768, 1024, 1280];

for (const width of widths) {
    const context = await browser.newContext({
        viewport: { width, height: 200 },
        deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.addStyleTag({
        content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
    });
    await page.locator('header').first().screenshot({
        path: `${OUT}/header-${width}.png`,
    });
    // Also extract the button visible text via DOM
    const buttonText = await page
        .locator('header a[href="/request-demo"]')
        .first()
        .innerText();
    console.log(`${width}px: button visible text = "${buttonText.trim()}"`);
    await context.close();
}

await browser.close();
