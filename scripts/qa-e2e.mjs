import { chromium } from 'playwright';

const BASE = 'http://localhost:4322';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto(`${BASE}/`);
await page.waitForLoadState('networkidle');

const results = [];
const test = async (name, fn) => {
    try {
        await fn();
        results.push({ name, status: 'PASS' });
    } catch (e) {
        results.push({ name, status: 'FAIL', error: e.message.slice(0, 200) });
    }
};

// 1. Skip-to-content link is the first focusable element
await test('Skip link is first focusable element', async () => {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() =>
        document.activeElement?.textContent?.trim()
    );
    if (focused !== 'Skip to main content') {
        throw new Error(`Got: ${focused}`);
    }
});

// 2. Skip link href correct
await test('Skip link targets #main-content', async () => {
    const href = await page
        .locator('a:has-text("Skip to main content")')
        .first()
        .getAttribute('href');
    if (href !== '#main-content') throw new Error(`Got: ${href}`);
});

// 3. Header CTA links to /request-demo
await test('Header CTA → /request-demo', async () => {
    const href = await page
        .locator('header a')
        .filter({ hasText: /Schedule/ })
        .first()
        .getAttribute('href');
    if (href !== '/request-demo') throw new Error(`Got: ${href}`);
});

// 4. Hero "Request a demo" CTA links to /request-demo
await test('Hero CTA → /request-demo', async () => {
    const href = await page
        .locator('main a:has-text("Request a demo")')
        .first()
        .getAttribute('href');
    if (href !== '/request-demo') throw new Error(`Got: ${href}`);
});

// 5. FinalCTA "Schedule a walkthrough" → /request-demo
await test('FinalCTA → /request-demo', async () => {
    const href = await page
        .locator('section:has(#final-cta-heading) a')
        .filter({ hasText: /Schedule a walkthrough/ })
        .first()
        .getAttribute('href');
    if (href !== '/request-demo') throw new Error(`Got: ${href}`);
});

// 6. Footer "View source" link
await test('Footer View source → GitHub repo, target=_blank, rel correct', async () => {
    const link = page.locator(
        'footer[aria-label="Site footer"] a[href*="github.com/Fgoldin52"]'
    );
    const href = await link.getAttribute('href');
    const target = await link.getAttribute('target');
    const rel = await link.getAttribute('rel');
    if (href !== 'https://github.com/Fgoldin52/sentinel-compliance-portfolio')
        throw new Error(`href: ${href}`);
    if (target !== '_blank') throw new Error(`target: ${target}`);
    if (!rel?.includes('noopener') || !rel?.includes('noreferrer'))
        throw new Error(`rel: ${rel}`);
});

// 7. Resources "View all publications" link
await test('Resources View all publications → /resources', async () => {
    const href = await page
        .locator('a:has-text("View all publications")')
        .first()
        .getAttribute('href');
    if (href !== '/resources') throw new Error(`Got: ${href}`);
});

// 8. Wordmark links to /
await test('Wordmark links to /', async () => {
    const href = await page
        .locator('header a:has-text("Sentinel Compliance")')
        .first()
        .getAttribute('href');
    if (href !== '/') throw new Error(`Got: ${href}`);
});

// 9. /request-demo navigates to 404 (the stub route)
await test('/request-demo lands on 404 page', async () => {
    const resp = await page.goto(`${BASE}/request-demo`);
    if (resp.status() !== 404)
        throw new Error(`Status: ${resp.status()}`);
    const h1 = await page.locator('h1').first().textContent();
    if (!h1.includes('sitemap'))
        throw new Error(`H1: ${h1}`);
});

// 10. 404 "Return to the homepage" link
await test('404 Return link → /', async () => {
    const href = await page
        .locator('main a:has-text("Return to the homepage")')
        .first()
        .getAttribute('href');
    if (href !== '/') throw new Error(`Got: ${href}`);
});

await browser.close();

console.log('\n=== E2E Results ===\n');
for (const r of results) {
    console.log(`${r.status === 'PASS' ? '✓' : '✗'} ${r.name}`);
    if (r.error) console.log(`  ${r.error}`);
}
const failed = results.filter((r) => r.status === 'FAIL').length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed > 0 ? 1 : 0);
