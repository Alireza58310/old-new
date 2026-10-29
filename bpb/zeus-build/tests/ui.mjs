// Browser smoke test of the Alireza panel (real Chromium, fake D1 + fake network behind a local http server).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH || '/home/claude/.npm-global/lib/node_modules/playwright');
const here = new URL('.', import.meta.url).pathname;
let ok = true; const check = (n, c, x = '') => { console.log((c ? 'PASS ' : 'FAIL ') + n + (x !== '' ? '  ' + x : '')); if (!c) ok = false; };

import { spawn } from 'node:child_process';
const child = spawn('node', ['--no-warnings', here + 'ui-server.mjs'], { stdio: ['ignore', 'pipe', 'inherit'] });
const port = await new Promise((res) => child.stdout.on('data', (d) => { const m = String(d).match(/PORT (\d+)/); if (m) res(m[1]); }));
const base = 'http://localhost:' + port;
process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'fa-IR', colorScheme: process.env.SCHEME || 'dark' })).newPage();
const errors = []; page.on('pageerror', e => errors.push('pageerror: ' + e.message)); page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text()) && !m.location().url.includes('/panel')) errors.push('console: ' + m.text()) });
page.on('dialog', d => d.accept());

await page.goto(base + '/admin/alireza'); await page.waitForURL('**/admin/login');
check('opening the panel without a password goes to the setup page', (await page.textContent('p')).includes('رمز عبور') && (await page.locator('input[type=text],input[name=username],input[type=email]').count()) === 0);
await page.fill('#p', 'pw12345'); await page.fill('#p2', 'pw12345'); await page.click('button'); await page.waitForURL('**/admin/panel');
check('after setup you are inside (BPB panel)', page.url().endsWith('/admin/panel'));
errors.length = 0; await page.goto(base + '/admin/alireza'); await page.waitForSelector('.brand');
check('Alireza opens with the same session (no 2nd login)', page.url().endsWith('/admin/alireza'));
await page.screenshot({ path: here + 'ui-empty.png' });

// create a user, search a country
await page.click('text=＋ کاربر جدید'); await page.fill('#fName', 'ali');
await page.click('.tab[data-t=t3]'); await page.fill('#uLocBox .lq', 'فرانسه'); await page.waitForSelector('#uLocBox_l .lc');
check('country search works in Persian (France -> CDG)', (await page.locator('#uLocBox_l .lc').first().textContent()).includes('CDG'));
await page.click('#uLocBox_l .lc >> nth=0'); await page.waitForSelector('#uLocBox_sel .chip'); await page.waitForFunction(() => document.querySelector('#uLocBox_sel').textContent.includes('v4:'));
check('picked location shows IPv4 + IPv6 counts', (await page.textContent('#uLocBox_sel')).includes('v4:1 v6:1'), await page.textContent('#uLocBox_sel'));
await page.click('.tab[data-t=t1]'); await page.click('#pT'); // trojan off
await page.screenshot({ path: here + 'ui-editor.png' });
await page.click('#uSave'); await page.waitForSelector('.u');
check('user card appears', (await page.textContent('.u .n')).includes('ali'));
check('Trojan toggle saved (only VLESS badge)', (await page.locator('.u .pill', { hasText: 'Trojan' }).count()) === 0 && (await page.locator('.u .pill', { hasText: 'VLESS' }).count()) === 1);

// settings: pin two global locations
await page.click('text=⚙ تنظیمات'); await page.fill('#gLocBox .lq', 'ams'); await page.click('#gLocBox_l .lc >> nth=0');
await page.fill('#gLocBox .lq', 'frankfurt'); await page.click('#gLocBox_l .lc >> nth=0');
check('two global locations selected', (await page.locator('#gLocBox_sel .chip').count()) === 2);
await page.click('.tab[data-t=s3]'); await page.screenshot({ path: here + 'ui-settings.png' });
await page.click('.tab[data-t=s1]'); await page.click('#mS .mf >> text=ذخیره'); await page.waitForTimeout(400);
// no filtering -> 4 users
await page.click('#bNF'); await page.waitForFunction(() => document.querySelectorAll('.u').length >= 5);
check('no filtering created 4 more users', (await page.locator('.u').count()) === 5, await page.locator('.u').count());
check('stats are shown', (await page.textContent('#sU')) === '5');
// info modal with links
await page.click('.u >> nth=0 >> text=ℹ لینک‌ها'); await page.waitForSelector('#iB .lk');
const nm = await page.locator('#iB .lk b').allTextContents();
check('info modal lists configs named "CC | flag | name"', nm.some(t => /^(NL|DE) \| .{2,4} \| /u.test(t)) && !nm.some(t => /zeus/i.test(t)), nm.slice(0, 4).join(' ; '));
await page.screenshot({ path: here + 'ui-info.png' }); await page.click('#mI .x');
await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(200); await page.screenshot({ path: here + 'ui-mobile.png' });
await page.setViewportSize({ width: 1280, height: 900 }); await page.screenshot({ path: here + 'ui-users.png' });
check('no JavaScript errors in the page', errors.length === 0, errors.join(' | ').slice(0, 300));
await browser.close(); child.kill();
console.log(ok ? 'ALL PASS' : 'SOME FAILED'); process.exit(ok ? 0 : 1);
