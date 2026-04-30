import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:4322';
const OUT = '/tmp/sentinel-qa-final';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const widths = [390, 768, 1280, 1920];

for (const width of widths) {
    const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Homepage full page
    await page.goto(`${BASE}/`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await page.screenshot({
        path: `${OUT}/home-${width}-full.png`,
        fullPage: true,
    });
    console.log(`✓ home-${width}-full.png`);

    // Targeted dense sections
    for (const { id, name } of [
        { id: 'reg-alignment-heading', name: 'reg-alignment' },
        { id: 'integrations-heading', name: 'integrations' },
        { id: 'security-heading', name: 'security' },
    ]) {
        const sec = page.locator(`section:has(#${id})`);
        await sec.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await sec.screenshot({
            path: `${OUT}/${name}-${width}.png`,
        });
    }
    console.log(`✓ dense sections at ${width}`);

    // 404 full page
    await page.goto(`${BASE}/some-nonexistent-route`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
        path: `${OUT}/404-${width}-full.png`,
        fullPage: true,
    });
    console.log(`✓ 404-${width}-full.png`);

    await context.close();
}

await browser.close();
console.log(`\nAll screenshots in ${OUT}`);
