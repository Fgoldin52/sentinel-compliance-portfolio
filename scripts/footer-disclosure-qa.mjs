import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/sentinel-mobile-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const width of [390, 1280]) {
    const context = await browser.newContext({
        viewport: { width, height: 800 },
        deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4321/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await page.addStyleTag({
        content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
    });

    const legal = page
        .locator('footer[aria-label="Site footer"] p:has-text("Portfolio piece")')
        .locator('xpath=ancestor::div[1]');
    await legal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await legal.screenshot({ path: `${OUT}/footer-disclosure-${width}.png` });

    // Verify link attributes
    const link = page.locator('footer a[href*="github.com/Fgoldin52"]');
    const target = await link.getAttribute('target');
    const rel = await link.getAttribute('rel');
    console.log(`${width}px: target="${target}" rel="${rel}"`);

    await context.close();
}

await browser.close();
