import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/sentinel-mobile-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14/15 size
    deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto('http://localhost:4321/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800); // allow font swap to settle

// Hide Astro dev toolbar so it doesn't float over content in screenshots
await page.addStyleTag({
    content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
});

const sections = [
    { id: 'trust-strip-heading', name: '1-trust-strip' },
    { id: 'reg-alignment-heading', name: '2-reg-alignment' },
    { id: 'integrations-heading', name: '3-integrations' },
    { id: 'security-heading', name: '4-security' },
];

for (const { id, name } of sections) {
    const sec = page.locator(`section:has(#${id})`);
    await sec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await sec.screenshot({ path: `${OUT}/${name}.png` });
    console.log(`✓ ${name}.png`);
}

await browser.close();
console.log(`\nScreenshots in ${OUT}`);
