import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/sentinel-mobile-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const width of [390, 1280]) {
    const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:4321/some-nonexistent-route');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await page.addStyleTag({
        content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
    });
    await page.screenshot({
        path: `${OUT}/404-${width}.png`,
        fullPage: true,
    });
    console.log(`✓ 404-${width}.png`);

    // Also grab the disclosure section to verify nbsp fix
    if (width === 390) {
        const legal = page
            .locator('footer[aria-label="Site footer"] p:has-text("Portfolio piece")')
            .locator('xpath=ancestor::div[1]');
        await legal.scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await legal.screenshot({
            path: `${OUT}/footer-disclosure-nbsp-${width}.png`,
        });
        console.log(`✓ footer-disclosure-nbsp-${width}.png`);
    }
    await context.close();
}

await browser.close();
