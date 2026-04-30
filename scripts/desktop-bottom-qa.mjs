import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/sentinel-mobile-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto('http://localhost:4321/');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);

await page.addStyleTag({
    content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
});

// Screenshot the FinalCTA + Footer transition
const finalCta = page.locator('section:has(#final-cta-heading)');
await finalCta.scrollIntoViewIfNeeded();
await page.waitForTimeout(250);

// Bounding box of FinalCTA section
const cta = await finalCta.boundingBox();
const footer = await page.locator('footer[aria-label="Site footer"]').boundingBox();

console.log(`FinalCTA: top=${cta.y}, height=${cta.height}, bottom=${cta.y + cta.height}`);
console.log(`Footer:   top=${footer.y}, height=${footer.height}`);
console.log(`Gap from FinalCTA bottom edge to Footer top edge: ${footer.y - (cta.y + cta.height)}px`);

// Capture screenshot covering both
await page.screenshot({
    path: `${OUT}/desktop-cta-footer.png`,
    clip: {
        x: 0,
        y: cta.y,
        width: 1280,
        height: footer.y + footer.height - cta.y,
    },
});

console.log('✓ desktop-cta-footer.png');
await browser.close();
