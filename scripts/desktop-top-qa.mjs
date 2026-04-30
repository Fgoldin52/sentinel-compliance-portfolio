import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/sentinel-mobile-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Desktop view of nav + hero top
const desktop = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
});
const dPage = await desktop.newPage();
await dPage.goto('http://localhost:4321/');
await dPage.waitForLoadState('networkidle');
await dPage.waitForTimeout(800);
await dPage.addStyleTag({
    content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
});
await dPage.screenshot({
    path: `${OUT}/desktop-nav-hero.png`,
    clip: { x: 0, y: 0, width: 1280, height: 600 },
});
console.log('✓ desktop-nav-hero.png');

// Mobile view of nav + hero top
const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
});
const mPage = await mobile.newPage();
await mPage.goto('http://localhost:4321/');
await mPage.waitForLoadState('networkidle');
await mPage.waitForTimeout(800);
await mPage.addStyleTag({
    content: 'astro-dev-toolbar, astro-dev-overlay { display: none !important; }',
});
await mPage.screenshot({
    path: `${OUT}/mobile-nav-hero.png`,
    clip: { x: 0, y: 0, width: 390, height: 600 },
});
console.log('✓ mobile-nav-hero.png');

await browser.close();
