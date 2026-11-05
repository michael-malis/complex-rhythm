import { chromium } from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:8767/';
const sizes = [
  [360, 640], [375, 812], [390, 844], [768, 1024],
  [1024, 768], [1280, 800], [1440, 900]
];
const errors = [];
const browser = await chromium.launch({ headless: true, args: [
  '--no-sandbox', '--autoplay-policy=no-user-gesture-required'
]});
const context = await browser.newContext({ acceptDownloads: true, reducedMotion: 'reduce' });
fs.mkdirSync('artifacts', { recursive: true });
let passes = 0;
const uiMetrics = new Map();
const verify = (condition, message) => { assert.ok(condition, message); passes++; };

try {
  for (const [width, height] of sizes) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    page.on('pageerror', error => errors.push(width + ': ' + error.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(180);
    const result = await page.evaluate(() => {
      const canvas = document.querySelector('#orbitCanvas');
      const rect = canvas.getBoundingClientRect();
      const editor = document.querySelector('#editor').getBoundingClientRect();
      const scene = document.querySelector('.visual-stage').getBoundingClientRect();
      return {
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        cw: rect.width, ch: rect.height,
        editorTop: editor.top, sceneTop: scene.top,
        chosen: document.querySelector('#presetSelect').value,
        tracks: document.querySelectorAll('#tracks .track-pick').length,
        slider: !document.querySelector('#argumentAngle').disabled,
        fieldHeight: document.querySelector('#editA').getBoundingClientRect().height,
        headingSize: parseFloat(getComputedStyle(document.querySelector('.brand h1')).fontSize),
        disclosureOpen: document.querySelector('#presetDetails').open,
        language: document.documentElement.lang,
        textHasCyrillic: /[А-Яа-яЁё]/.test(document.body.innerText)
      };
    });
    verify(result.scroll <= result.viewport + 2,
      'horizontal overflow at ' + width + ': ' + JSON.stringify(result));
    verify(result.cw > 190 && Math.abs(result.cw - result.ch) < 1.5,
      'canvas not square at ' + width + ': ' + JSON.stringify(result));
    uiMetrics.set(width,result);
    verify(result.tracks === 4, 'missing tracks at ' + width);
    verify(result.language === 'en' && !result.textHasCyrillic,'UI is not fully English at '+width);
    verify(width >= 950 ? result.disclosureOpen : !result.disclosureOpen,
      'examples disclosure does not follow responsive layout at '+width);
    verify(result.chosen === 'afro', 'not a mathematical initial preset at ' + width);
    verify(result.slider, 'argument slider disabled at ' + width);
    if (width < 950) verify(result.editorTop < result.sceneTop,
      'mathematical controls not visible before canvas at ' + width);
    await page.screenshot({ path: 'artifacts/rhythm-' + width + 'x' + height + '.png', fullPage: true });
    console.log('PASS viewport', width + 'x' + height, JSON.stringify(result));
    await page.close();
  }

  verify(uiMetrics.get(1440).cw > uiMetrics.get(1024).cw,'canvas is not scaling up at desktop widths');
  verify(uiMetrics.get(1440).fieldHeight > uiMetrics.get(360).fieldHeight,
    'actual input controls are not scaling with viewport');
  verify(uiMetrics.get(1440).headingSize > uiMetrics.get(360).headingSize,
    'typography is not scaling with viewport');

  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  page.on('pageerror', error => errors.push('interaction: ' + error.message));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('#editN').fill('6');
  verify((await page.locator('#hitCount').textContent()).includes('6 hits'),
    'degree does not change hit count');

  await page.locator('#editN').fill('3');
  await page.locator('#argumentAngle').evaluate(el => {
    el.value = '90'; el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  let a = Number(await page.locator('#editA').inputValue());
  let b = Number(await page.locator('#editB').inputValue());
  verify(Math.abs(a) < .0001 && Math.abs(b-1) < .0001,
    'angle slider does not rotate complex number to +i');
  verify((await page.locator('#hitCount').textContent()).includes('3 hits'),
    'angle slider changed hit count');

  await page.locator('#editA').fill('0');
  await page.locator('#editB').fill('0');
  verify(await page.locator('#argumentAngle').isDisabled(),
    'zero complex number must disable argument slider');
  await page.locator('#editA').fill('1');
  verify(await page.locator('#argumentAngle').isEnabled(),
    'nonzero complex number must enable argument slider');

  // Reset to an exact, known three-root construction (z=1).
  await page.locator('#presetSelect').selectOption('minimal');
  await page.locator('#presetSelect').selectOption('afro');

  // First root is at the top of the outer ring; drag it clockwise by 20°.
  const rect = await page.locator('#orbitCanvas').boundingBox();
  verify(!!rect, 'canvas has no bounding box');
  const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
  const radius = Math.min(rect.width, rect.height) * .427;
  const alpha = Math.PI / 9;
  await page.mouse.move(cx, cy-radius);
  await page.mouse.down();
  await page.mouse.move(cx + radius*Math.sin(alpha), cy-radius*Math.cos(alpha),
    { steps: 15 });
  await page.mouse.up();
  a = Number(await page.locator('#editA').inputValue());
  b = Number(await page.locator('#editB').inputValue());
  const movedArg = Math.atan2(b, a) * 180 / Math.PI;
  verify(Math.abs(movedArg-60) < 4,
    'drag must rotate z by n times root angle; actual ' + movedArg);

  await page.locator('#orbitCanvas').focus();
  await page.keyboard.press('Shift+ArrowRight');
  a = Number(await page.locator('#editA').inputValue());
  b = Number(await page.locator('#editB').inputValue());
  const keyboardArg = Math.atan2(b, a) * 180 / Math.PI;
  verify(Math.abs(keyboardArg-75) < 4,
    'Shift+Right must turn roots 5 degrees; actual z arg ' + keyboardArg);

  // Inspect every published preset without rewriting any preset data.
  let total = 0;
  const categories = await page.locator('#categorySelect option').evaluateAll(
    els => els.map(o => o.value));
  for (const category of categories) {
    await page.locator('#categorySelect').selectOption(category);
    const ids = await page.locator('#presetSelect option').evaluateAll(
      els => els.map(o => o.value).filter(x => x !== '__custom__'));
    for (const id of ids) {
      await page.locator('#presetSelect').selectOption(id);
      verify((await page.locator('#tracks .track-pick').count()) === 4,
        'preset missing one or more tracks: ' + id);
      total++;
    }
  }
  verify(total === 35, 'expected 35 examples; got ' + total);
  await page.locator('#categorySelect').selectOption('poly');
  const polyNames=await page.locator('#presetSelect option').allTextContents();
  for(const name of ['2 : 3','3 : 4','3 : 5','4 : 7','5 : 7'])
    verify(polyNames.some(n=>n.includes(name)),'missing polyrhythm '+name);
  await page.locator('#categorySelect').selectOption('brazil');
  const remainingBossa=await page.locator('#presetSelect option').allTextContents();
  verify(remainingBossa.filter(n=>n.includes('Bossa Nova')).length===1,'expected one Bossa Nova');
  await page.locator('#categorySelect').selectOption('poly');
  console.log('PASS all presets:', total);

  // JSON serialization and deserialization.
  await page.locator('.file-actions summary').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#saveBtn').click();
  const download = await downloadPromise;
  const text = fs.readFileSync(await download.path(), 'utf8');
  const saved = JSON.parse(text);
  verify(saved.format === 'roots-rhythm/1' && saved.tracks.length === 4,
    'JSON export incompatible');
  await page.locator('#jsonFile').setInputFiles({
    name: 'roundtrip.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text)
  });
  await page.waitForTimeout(70);
  verify((await page.locator('#toast').textContent()).includes('Imported'),
    'JSON import failed');

  // Real Web Audio transport smoke check; sample loading may remain asynchronous.
  await page.locator('#playBtn').click();
  await page.waitForTimeout(900);
  verify((await page.locator('#playBtn').textContent()).includes('Pause'),
    'Web Audio transport failed to start');
  await page.locator('#playBtn').click();
  console.log('PASS transport start/pause');

  await page.screenshot({path:'artifacts/rhythm-interactions.png',fullPage:true});
  verify(errors.length === 0, 'browser JS errors: ' + errors.join('; '));
  console.log('ALL PASS:', passes, 'assertions |', sizes.length, 'viewports | 35 presets | drag / slider / keyboard / JSON / audio');
  await page.close();
} finally {
  await context.close();
  await browser.close();
}
