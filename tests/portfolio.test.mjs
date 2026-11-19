import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const BUILD_MOD_PATH = path.join(ROOT_DIR, 'scripts', 'build.mjs');
const CODE_LENGTH_ORDER = [17, 18, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const EXPECTED_CAPSTONE_SCREENS = [
  { file: '01-main-gate-dashboard.webp', w: 896, h: 1200, phrase: 'Main Gate' },
  { file: '02-resident-dashboard.webp', w: 768, h: 1376, phrase: 'Health Center Status' },
  { file: '03-central-admin-dashboard.webp', w: 768, h: 1376, phrase: 'Punong Barangay' },
  { file: '04-healthcare-admin-dashboard.webp', w: 768, h: 1376, phrase: 'Poblacion Health Center' },
  { file: '05-tanod-admin-dashboard.webp', w: 768, h: 1376, phrase: 'Command Central' },
  { file: '06-tanod-field-dashboard.webp', w: 768, h: 1376, phrase: 'Tactical Radar' }
];

async function loadBuildHelpers() {
  return import(`file:///${BUILD_MOD_PATH.replaceAll('\\', '/')}`);
}

function readSrc(relPath) {
  return fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
}

function readWebpDimensions(buf) {
  assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buf.toString('ascii', 8, 12), 'WEBP');
  const fourCC = buf.toString('ascii', 12, 16);
  const chunkPayloadStart = 20;
  if (fourCC === 'VP8 ') {
    assert.equal(buf[chunkPayloadStart + 3], 0x9d, 'Expected VP8 keyframe start code byte 0');
    assert.equal(buf[chunkPayloadStart + 4], 0x01, 'Expected VP8 keyframe start code byte 1');
    assert.equal(buf[chunkPayloadStart + 5], 0x2a, 'Expected VP8 keyframe start code byte 2');
    const w = buf.readUInt16LE(chunkPayloadStart + 6) & 0x3fff;
    const h = buf.readUInt16LE(chunkPayloadStart + 8) & 0x3fff;
    return { codec: 'VP8 ', w, h };
  }
  if (fourCC === 'VP8L') {
    const packed = buf.readUInt32LE(chunkPayloadStart + 1);
    return { codec: 'VP8L', w: (packed & 0x3fff) + 1, h: ((packed >>> 14) & 0x3fff) + 1 };
  }
  throw new Error(`Unsupported WebP chunk fourCC "${fourCC}"`);
}

function createMockElement(attrs = {}, textContent = '', tagName = 'div') {
  const listeners = new Map();
  const children = [];
  return {
    tagName: tagName.toUpperCase(),
    className: attrs.class || '',
    children,
    attributes: { ...attrs },
    dataset: Object.fromEntries(
      Object.entries(attrs)
        .filter(([k]) => k.startsWith('data-'))
        .map(([k, v]) => [k.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase()), v])
    ),
    hidden: Object.hasOwn(attrs, 'hidden'),
    open: false,
    focusedCount: 0,
    alt: attrs.alt || '',
    textContent,
    _src: attrs.src || null,
    get firstChild() {
      return children[0] || null;
    },
    get src() {
      return this._src || '';
    },
    set src(val) {
      this._src = val;
      this.attributes.src = val;
    },
    appendChild(child) {
      children.push(child);
      return child;
    },
    removeChild(child) {
      const idx = children.indexOf(child);
      if (idx !== -1) children.splice(idx, 1);
      return child;
    },
    getAttribute(name) {
      return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === 'src') this._src = String(value);
    },
    hasAttribute(name) {
      return Object.hasOwn(this.attributes, name);
    },
    removeAttribute(name) {
      delete this.attributes[name];
      if (name === 'src') this._src = null;
    },
    addEventListener(type, fn) {
      const list = listeners.get(type) || [];
      list.push(fn);
      listeners.set(type, list);
    },
    async dispatchEvent(evt) {
      const calls = (listeners.get(evt.type) || []).map((fn) => fn(evt));
      await Promise.all(calls);
    },
    focus() {
      this.focusedCount += 1;
    }
  };
}

function runMainJsWithDom({ secureContext = true, clipboardImpl = null, grouped = false, withDetails = false, withCertDetails = false } = {}) {
  const jsSource = readSrc('src/scripts/main.js');
  const triggers = [1, 2, 3].map((idx) =>
    createMockElement({
      href: `/assets/screenshots/capstone-screen-${idx}.webp`,
      'data-lightbox': '',
      ...(grouped ? { 'data-lightbox-group': 'capstone' } : {}),
      'data-lightbox-alt': `Alt ${idx}`,
      'data-lightbox-caption': `Caption ${idx}`,
      ...(withDetails
        ? {
            'data-lightbox-title': `App ${idx} Title`,
            'data-lightbox-role': `Target Users: Role ${idx}`,
            'data-lightbox-summary': `Summary ${idx}`,
            'data-lightbox-features': `Feature ${idx}A|Feature ${idx}B|Feature ${idx}C`,
            'data-lightbox-stack': `Flutter · Cloud Firestore ${idx}`
          }
        : {})
    })
  );
  if (grouped) {
    triggers.push(
      createMockElement({
        href: '/assets/certificates/devfest-bacolod-2025.jpg',
        'data-lightbox': '',
        'data-lightbox-group': 'certificates',
        'data-lightbox-alt': 'DevFest Certificate Alt',
        'data-lightbox-caption': 'DevFest Bacolod 2025',
        ...(withCertDetails
          ? {
              'data-lightbox-eyebrow': 'Verified Credential',
              'data-lightbox-title': 'Google DevFest Bacolod 2025',
              'data-lightbox-role': 'Issued by Google Developer Groups Bacolod',
              'data-lightbox-summary': 'Awarded for DevFest Bacolod 2025.',
              'data-lightbox-features-label': 'Credential Details',
              'data-lightbox-features': 'Recipient: Jay-R Sarino|Date: Nov 22, 2025|Venue: USLS|Signatory: Dave Celo',
              'data-lightbox-stack-label': 'Credential Format',
              'data-lightbox-stack': 'Certificate of Attendance'
            }
          : {})
      })
    );
    if (withCertDetails) {
      triggers.push(
        createMockElement({
          href: '/assets/certificates/opswat-icip-2026.jpg',
          'data-lightbox': '',
          'data-lightbox-group': 'certificates',
          'data-lightbox-alt': 'OPSWAT Certificate Alt',
          'data-lightbox-caption': 'OPSWAT ICIP',
          'data-lightbox-eyebrow': 'Verified Credential',
          'data-lightbox-title': 'Introduction to Critical Infrastructure Protection',
          'data-lightbox-role': 'Issued by OPSWAT Academy',
          'data-lightbox-summary': 'Graduate of Introduction to CIP.',
          'data-lightbox-features-label': 'Credential Details',
          'data-lightbox-features': 'ID: k1uxD4krPw|Issued: 2026|Credits: 0.50 CPE|Signatories: OPSWAT',
          'data-lightbox-stack-label': 'Verification Record',
          'data-lightbox-stack': 'OPSWAT Academy',
          'data-lightbox-verify': 'https://learn.opswatacademy.com/certificate/k1uxD4krPw'
        })
      );
    }
  }
  const img = createMockElement({ 'data-lightbox-img': '', alt: '' });
  const captionEl = createMockElement({ 'data-lightbox-caption-text': '' });
  const counterEl = createMockElement({ 'data-lightbox-counter': '' });
  const errorEl = createMockElement({ 'data-lightbox-error': '', hidden: '' });
  const directLink = createMockElement({ 'data-lightbox-direct': '', href: '#' });
  const closeBtn = createMockElement({ 'data-lightbox-close': '' });
  const prevBtn = createMockElement({ 'data-lightbox-prev': '' });
  const nextBtn = createMockElement({ 'data-lightbox-next': '' });
  const dialog = createMockElement({ 'data-lightbox-modal': '' });
  const detailsEl = withDetails ? createMockElement({ 'data-lightbox-details': '', hidden: '' }, '', 'aside') : null;
  const eyebrowEl = withDetails ? createMockElement({ 'data-lightbox-panel-eyebrow': '' }, 'How It Works', 'p') : null;
  const titleEl = withDetails ? createMockElement({ 'data-lightbox-panel-title': '' }, '', 'h2') : null;
  const roleEl = withDetails ? createMockElement({ 'data-lightbox-panel-role': '' }, '', 'p') : null;
  const summaryEl = withDetails ? createMockElement({ 'data-lightbox-panel-summary': '' }, '', 'p') : null;
  const featuresLabelEl = withDetails ? createMockElement({ 'data-lightbox-panel-features-label': '' }, 'Core Application Workflow', 'h3') : null;
  const featuresEl = withDetails ? createMockElement({ 'data-lightbox-panel-features': '' }, '', 'ul') : null;
  const stackLabelEl = withDetails ? createMockElement({ 'data-lightbox-panel-stack-label': '' }, 'Stack & Cloud Integration', 'p') : null;
  const stackEl = withDetails ? createMockElement({ 'data-lightbox-panel-stack': '' }, '', 'p') : null;
  const verifyEl = withDetails ? createMockElement({ 'data-lightbox-verify': '', href: '#', hidden: '' }, 'Verify Certificate', 'a') : null;

  const modalChildren = {
    '[data-lightbox-img]': img,
    '[data-lightbox-caption-text]': captionEl,
    '[data-lightbox-counter]': counterEl,
    '[data-lightbox-error]': errorEl,
    '[data-lightbox-direct]': directLink,
    '[data-lightbox-close]': closeBtn,
    '[data-lightbox-prev]': prevBtn,
    '[data-lightbox-next]': nextBtn,
    ...(withDetails
      ? {
          '[data-lightbox-details]': detailsEl,
          '[data-lightbox-panel-eyebrow]': eyebrowEl,
          '[data-lightbox-panel-title]': titleEl,
          '[data-lightbox-panel-role]': roleEl,
          '[data-lightbox-panel-summary]': summaryEl,
          '[data-lightbox-panel-features-label]': featuresLabelEl,
          '[data-lightbox-panel-features]': featuresEl,
          '[data-lightbox-panel-stack-label]': stackLabelEl,
          '[data-lightbox-panel-stack]': stackEl,
          '[data-lightbox-verify]': verifyEl
        }
      : {})
  };

  dialog.querySelector = (sel) => modalChildren[sel] || null;
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent({ type: 'close' });
  };

  const emailBtn = createMockElement({
    hidden: '',
    'data-email-copy': '',
    'data-email-address': 'Aronsarino435@gmail.com'
  });
  const emailStatus = createMockElement({ 'data-email-status': '' });

  const codePairs = [1, 2].map((idx) => {
    const status = createMockElement({ 'data-code-status': '' });
    const block = createMockElement({}, `snippet-${idx}`);
    const btn = createMockElement({ hidden: '', 'data-code-copy': '' });
    btn.closest = (selector) => {
      assert.equal(selector, 'details');
      return {
        querySelector(sel) {
          if (sel === 'pre code' || sel === 'code') return block;
          if (sel === '[data-code-status]') return status;
          return null;
        }
      };
    };
    return { btn, status, block };
  });

  const docListeners = new Map();
  const bySelector = {
    '[data-lightbox-modal]': dialog,
    '[data-lightbox-title]': triggers[0],
    ...modalChildren,
    '[data-email-copy]': emailBtn,
    '[data-email-status]': emailStatus
  };

  const mockDoc = {
    readyState: 'complete',
    createElement: (tag) => createMockElement({}, '', tag),
    querySelector: (sel) => bySelector[sel] || null,
    querySelectorAll: (sel) => {
      if (sel === 'a[data-lightbox]') return triggers;
      if (sel === '[data-code-copy]') return codePairs.map((p) => p.btn);
      return [];
    },
    addEventListener: (type, fn) => {
      const list = docListeners.get(type) || [];
      list.push(fn);
      docListeners.set(type, list);
    },
    async dispatchEvent(evt) {
      const calls = (docListeners.get(evt.type) || []).map((fn) => fn(evt));
      await Promise.all(calls);
    }
  };

  vm.runInNewContext(jsSource, {
    document: mockDoc,
    window: { isSecureContext: secureContext },
    navigator: clipboardImpl ? { clipboard: clipboardImpl } : {},
    console
  });

  return { triggers, img, captionEl, counterEl, errorEl, directLink, closeBtn, prevBtn, nextBtn, dialog, detailsEl, eyebrowEl, titleEl, roleEl, summaryEl, featuresLabelEl, featuresEl, stackLabelEl, stackEl, verifyEl, emailBtn, emailStatus, codePairs, mockDoc };
}

test('Phase A: build.mjs exports testable validation helpers and rejects unknown flags / draft markers', async () => {
  const buildMod = await loadBuildHelpers();
  assert.equal(typeof buildMod.resolveSiteUrl, 'function');
  assert.equal(typeof buildMod.assertNoPlaceholdersInHtml, 'function');
  assert.equal(typeof buildMod.assertCleanWebp, 'function');
  assert.equal(typeof buildMod.assertCleanJpeg, 'function');

  assert.throws(() => buildMod.assertNoPlaceholdersInHtml('<h2 data-owner-draft>Sample</h2>', 'index.html', true), /data-owner-draft/i);
  assert.throws(() => buildMod.assertNoPlaceholdersInHtml('<p>[PHASE 2 OWNER INPUT]</p>', 'index.html', true), /PHASE 2 OWNER INPUT/);
  assert.throws(() => buildMod.assertNoPlaceholdersInHtml('<h2>Title (Sample Draft)</h2>', 'index.html', true), /Sample Draft/i);
  assert.throws(() => buildMod.assertNoPlaceholdersInHtml('<a href="https://example.invalid/cv">CV</a>', 'index.html', true), /example\.invalid/i);
  assert.doesNotThrow(() => buildMod.assertNoPlaceholdersInHtml('<h1>Jay-R Sarino</h1><a href="https://github.com/donaron">GitHub</a>', 'index.html', true));
  const actualIndexHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'index.html'), 'utf8');
  assert.doesNotThrow(() => buildMod.assertNoPlaceholdersInHtml(actualIndexHtml, 'index.html', true));

  assert.throws(
    () => execFileSync(process.execPath, [BUILD_MOD_PATH, '--relase'], { cwd: ROOT_DIR, stdio: 'pipe' }),
    /Unknown build flag/i
  );
});

test('Phase A: resolveSiteUrl enforces production https domain-root rules in release mode', async () => {
  const { resolveSiteUrl } = await loadBuildHelpers();
  assert.equal(resolveSiteUrl(false, undefined), 'http://127.0.0.1:4173');
  assert.equal(resolveSiteUrl(true, 'https://jayrsarino.pages.dev/'), 'https://jayrsarino.pages.dev');
  assert.throws(() => resolveSiteUrl(true, ''), /requires SITE_URL/);
  assert.throws(() => resolveSiteUrl(true, 'http://jayrsarino.pages.dev'), /https:\/\//);
  assert.throws(() => resolveSiteUrl(true, 'https://127.0.0.1'), /loopback|placeholder/);
  assert.throws(() => resolveSiteUrl(true, 'https://jayrsarino.pages.dev/subpath'), /domain root/);
});

test('Phase A: metadata inspectors reject EXIF/empty WebP and APP1/APP13/COM/corrupt JPEG', async () => {
  const { assertCleanWebp, assertCleanJpeg } = await loadBuildHelpers();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-meta-test-'));

  try {
    const screenshotsDir = path.join(ROOT_DIR, 'src', 'assets', 'screenshots');
    const firstWebp = fs.readdirSync(screenshotsDir).filter((n) => n.endsWith('.webp')).sort()[0];
    assert.ok(firstWebp, 'Expected at least one WebP screenshot in src/assets/screenshots');
    const cleanWebp = fs.readFileSync(path.join(screenshotsDir, firstWebp));
    const exifChunk = Buffer.from([0x45, 0x58, 0x49, 0x46, 0x04, 0x00, 0x00, 0x00, 0x49, 0x49, 0x2a, 0x00]);
    const poisonedWebp = Buffer.concat([cleanWebp, exifChunk]);
    poisonedWebp.writeUInt32LE(poisonedWebp.length - 8, 4);
    const badWebpPath = path.join(tmpDir, 'bad.webp');
    fs.writeFileSync(badWebpPath, poisonedWebp);
    assert.throws(() => assertCleanWebp(badWebpPath), /EXIF/);

    const emptyWebp = Buffer.from('RIFF\x04\x00\x00\x00WEBP', 'binary');
    const emptyWebpPath = path.join(tmpDir, 'empty.webp');
    fs.writeFileSync(emptyWebpPath, emptyWebp);
    assert.throws(() => assertCleanWebp(emptyWebpPath), /missing VP8\/VP8L/i);

    const cleanJpg = fs.readFileSync(path.join(ROOT_DIR, 'src', 'assets', 'og-preview.jpg'));
    for (const [label, markerByte] of [['APP1', 0xe1], ['APP13', 0xed], ['COM', 0xfe]]) {
      const seg = Buffer.from([0xff, markerByte, 0x00, 0x06, 0x41, 0x42, 0x43, 0x00]);
      const p = path.join(tmpDir, `bad_${label}.jpg`);
      fs.writeFileSync(p, Buffer.concat([cleanJpg.subarray(0, 2), seg, cleanJpg.subarray(2)]));
      assert.throws(() => assertCleanJpeg(p), new RegExp(label, 'i'));
    }

    const corruptJpg = Buffer.from([0xff, 0xd8, 0x12, 0x34, 0xff, 0xda]);
    const corruptPath = path.join(tmpDir, 'corrupt.jpg');
    fs.writeFileSync(corruptPath, corruptJpg);
    assert.throws(() => assertCleanJpeg(corruptPath), /0xFF|marker prefix/i);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Phase A: BarangayConnect WebP dashboard assets decode clean frames and meet byte budgets', async () => {
  const { assertCleanWebp } = await loadBuildHelpers();
  for (const spec of EXPECTED_CAPSTONE_SCREENS) {
    const filePath = path.join(ROOT_DIR, 'src', 'assets', 'screenshots', spec.file);
    assert.ok(fs.existsSync(filePath), `Missing capstone screenshot at src/assets/screenshots/${spec.file}`);
    assertCleanWebp(filePath);
    const buf = fs.readFileSync(filePath);
    assert.ok(buf.length > 5_000 && buf.length <= 200_000, `${spec.file} size ${buf.length} outside (5KB, 200KB]`);
    const dims = readWebpDimensions(buf);
    assert.equal(dims.w, spec.w, `${spec.file} width mismatch`);
    assert.equal(dims.h, spec.h, `${spec.file} height mismatch`);
  }
});

test('Phase A: generated og-preview.jpg has 1200x630 SOF0 frame, clean JPEG structure, and Amethyst Dusk colors', () => {
  const buf = fs.readFileSync(path.join(ROOT_DIR, 'src', 'assets', 'og-preview.jpg'));
  assert.ok(buf.length <= 150_000);
  assert.equal(buf[0], 0xff);
  assert.equal(buf[1], 0xd8);
  let foundSof0 = false;
  let offset = 2;
  let scanStart = -1;
  const huffTables = { dc: new Map(), ac: new Map() };

  while (offset < buf.length) {
    while (offset < buf.length && buf[offset] === 0xff) offset += 1;
    const marker = buf[offset++];
    assert.ok(!(marker >= 0xe1 && marker <= 0xef) && marker !== 0xfe, `Disallowed JPEG metadata marker 0x${marker.toString(16)}`);
    const len = buf.readUInt16BE(offset);
    if (marker === 0xda) {
      scanStart = offset + len;
      break;
    }
    if (marker === 0xc0) {
      foundSof0 = true;
      assert.equal(buf.readUInt16BE(offset + 3), 630);
      assert.equal(buf.readUInt16BE(offset + 5), 1200);
    } else if (marker === 0xc4) {
      let pos = offset + 2;
      const end = offset + len;
      while (pos < end) {
        const info = buf[pos++];
        const cls = (info >> 4) === 0 ? 'dc' : 'ac';
        const tblId = info & 0x0f;
        const counts = buf.subarray(pos, pos + 16);
        pos += 16;
        const map = new Map();
        let code = 0;
        for (let bits = 1; bits <= 16; bits += 1) {
          for (let k = 0; k < counts[bits - 1]; k += 1) {
            map.set(`${bits}:${code}`, buf[pos++]);
            code += 1;
          }
          code <<= 1;
        }
        huffTables[cls].set(tblId, map);
      }
    }
    offset += len;
  }
  assert.ok(foundSof0);
  assert.ok(scanStart > 0 && huffTables.dc.size >= 2 && huffTables.ac.size >= 2);

  // Decode solid 8x8 macroblock DC levels from entropy stream to verify Dusk colors
  let ptr = scanStart;
  let bitBuf = 0;
  let bitCount = 0;
  const nextBit = () => {
    while (bitCount < 1) {
      let b = buf[ptr++];
      if (b === 0xff && buf[ptr] === 0x00) ptr += 1;
      bitBuf = (bitBuf << 8) | b;
      bitCount += 8;
    }
    bitCount -= 1;
    return (bitBuf >> bitCount) & 1;
  };
  const readBits = (n) => {
    let val = 0;
    for (let i = 0; i < n; i += 1) val = (val << 1) | nextBit();
    return val;
  };
  const decodeSym = (map) => {
    let code = 0;
    for (let bits = 1; bits <= 16; bits += 1) {
      code = (code << 1) | nextBit();
      const hit = map.get(`${bits}:${code}`);
      if (hit !== undefined) return hit;
    }
    throw new Error('Invalid JPEG Huffman symbol in og-preview.jpg');
  };
  const decodeMag = (cat) => {
    if (cat === 0) return 0;
    const raw = readBits(cat);
    return raw >= (1 << (cat - 1)) ? raw : raw - (1 << cat) + 1;
  };

  const cols = 150;
  const rows = 79;
  const prevDc = [0, 0, 0];
  const sampled = {};
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      for (let comp = 0; comp < 3; comp += 1) {
        const tblId = comp === 0 ? 0 : 1;
        const cat = decodeSym(huffTables.dc.get(tblId));
        prevDc[comp] += decodeMag(cat);
        let idx = 1;
        while (idx < 64) {
          const acSym = decodeSym(huffTables.ac.get(tblId));
          if (acSym === 0x00) break;
          if (acSym === 0xf0) {
            idx += 16;
            continue;
          }
          idx += (acSym >> 4) + 1;
          readBits(acSym & 0x0f);
        }
      }
      const key = `${r},${c}`;
      if (key === '0,0' || key === '5,1' || key === '10,10' || key === '20,20') {
        const y = prevDc[0] + 128;
        const cb = prevDc[1];
        const cr = prevDc[2];
        const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
        sampled[key] = [
          clamp(y + 1.402 * cr),
          clamp(y - 0.344136 * cb - 0.714136 * cr),
          clamp(y + 1.772 * cb)
        ];
      }
    }
  }

  const assertClose = (got, exp, label) => {
    for (let i = 0; i < 3; i += 1) {
      assert.ok(Math.abs(got[i] - exp[i]) <= 5, `${label} channel ${i}: expected ~${exp[i]}, got ${got[i]}`);
    }
  };
  assertClose(sampled['0,0'], [232, 121, 249], 'og-preview top fuchsia band');
  assertClose(sampled['5,1'], [15, 7, 32], 'og-preview outer Dusk canvas');
  assertClose(sampled['10,10'], [27, 16, 53], 'og-preview Dusk card surface');
  assertClose(sampled['20,20'], [245, 243, 255], 'og-preview hero title bar');
});

test('Phase B: index.html & 404.html remove raw bracket noise and guard all draft figures cleanly', () => {
  const indexHtml = readSrc('src/index.html');
  const notFoundHtml = readSrc('src/404.html');
  assert.equal(indexHtml.includes('[PHASE 2 OWNER INPUT]'), false);
  assert.equal(notFoundHtml.includes('[PHASE 2 OWNER INPUT]'), false);
  assert.equal(/\bdata-owner-draft\b/i.test(indexHtml), false, 'Release-ready index.html must contain zero data-owner-draft markers');
  assert.equal([...indexHtml.matchAll(/<figure\b[^>]*data-owner-draft\b/gi)].length, 0, 'Verified BarangayConnect capstone and certificate figures must not carry data-owner-draft');
  assert.equal([...indexHtml.matchAll(/<pre\b[^>]*data-owner-draft\b/gi)].length, 0, 'Representative scrubbed snippet <pre> blocks must have data-owner-draft cleared for release');
  assert.equal(/example\.invalid/i.test(indexHtml), false, 'All example.invalid CV/LinkedIn placeholders must be replaced or removed');
});

test('Phase B: strict CSP, landmarks, scroll offsets, footer touch targets, grid wrapping, headings, and rel safety', () => {
  const indexHtml = readSrc('src/index.html');
  const notFoundHtml = readSrc('src/404.html');
  const headers = readSrc('src/_headers');
  const mainJs = readSrc('src/scripts/main.js');

  for (const directive of ["default-src 'self'", "style-src 'self'", "script-src 'self'", "object-src 'none'", "frame-ancestors 'none'"]) {
    assert.ok(headers.includes(directive), `_headers missing CSP directive: ${directive}`);
  }
  assert.equal(/\binnerHTML\b/i.test(mainJs), false, 'main.js must avoid innerHTML');

  for (const [name, html] of [['index.html', indexHtml], ['404.html', notFoundHtml]]) {
    assert.equal(/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), false, `${name} contains inline <script>`);
    assert.equal(/<style\b/i.test(html), false, `${name} contains inline <style>`);
    assert.equal(/\sstyle\s*=\s*["']/i.test(html), false, `${name} contains style=`);
    assert.equal(/\son[a-z]+\s*=/i.test(html), false, `${name} contains inline event handler`);
    assert.match(html, /<html lang="en">/, `${name} missing lang="en"`);
  }

  for (const tag of ['<header', '<nav aria-label="Primary"', '<main id="main-content"', '<footer', 'href="#main-content"']) {
    assert.ok(indexHtml.includes(tag), `index.html missing landmark/skip-link: ${tag}`);
  }

  // Verify md:sticky clearance matches md:scroll-mt-24 without duplicate sm:scroll-mt-*
  assert.match(indexHtml, /<header[^>]*\bmd:sticky\b/);
  for (const id of ['about', 'stack', 'capstone', 'certificates', 'contact']) {
    const match = indexHtml.match(new RegExp(`<section[^>]*id="${id}"[^>]*class="([^"]*)"`, 'i'));
    assert.ok(match);
    assert.match(match[1], /\bmd:scroll-mt-24\b/, `section#${id} requires md:scroll-mt-24`);
    assert.equal(/\bsm:scroll-mt-\d+\b/.test(match[1]), false, `section#${id} should not carry redundant sm:scroll-mt-*`);
  }

  // Verify footer links meet 44px minimum touch height
  const footerMatch = indexHtml.match(/<footer[\s\S]*?<\/footer>/i);
  assert.ok(footerMatch);
  for (const linkMatch of footerMatch[0].matchAll(/<a\b[^>]*class="([^"]*)"/gi)) {
    assert.match(linkMatch[1], /\bmin-h-11\b/, `Footer link missing min-h-11: ${linkMatch[0]}`);
  }

  // Verify contact responsive grid uses explicit grid-cols-1, safe mailto wrapping, and verified GitHub + Gmail
  const contactMatch = indexHtml.match(/<section[^>]*id="contact"[\s\S]*?<\/section>/i);
  assert.ok(contactMatch);
  assert.match(contactMatch[0], /\bgrid-cols-1\b/);
  assert.match(contactMatch[0], /mailto:Aronsarino435@gmail\.com"[^>]*\bmax-w-full\b/);
  assert.match(contactMatch[0], /data-email-address="Aronsarino435@gmail\.com"/);
  assert.match(contactMatch[0], /href="https:\/\/github\.com\/donaron"/);
  assert.equal(contactMatch[0].includes('portfolio-contact@example.invalid'), false);
  assert.equal(contactMatch[0].includes('https://example.invalid/github'), false);
  assert.match(contactMatch[0], /\bbreak-all\b/);

  const headings = [...indexHtml.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  assert.equal(headings[0], 1, 'First heading must be h1');
  assert.equal(headings.filter((h) => h === 1).length, 1);
  for (let i = 1; i < headings.length; i += 1) {
    assert.ok(headings[i] <= headings[i - 1] + 1, `Skipped heading h${headings[i - 1]} -> h${headings[i]}`);
  }
  for (const tag of indexHtml.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    assert.match(tag[0], /rel="noopener noreferrer"/);
  }
});

test('Phase B: index.html provides Prev/Next, counter, direct fallback link, and code copy hooks', () => {
  const indexHtml = readSrc('src/index.html');
  for (const selector of [
    'data-lightbox-modal', 'data-lightbox-img', 'data-lightbox-caption-text',
    'data-lightbox-error', 'data-lightbox-close', 'data-lightbox-prev',
    'data-lightbox-next', 'data-lightbox-counter', 'data-lightbox-direct', 'data-code-copy'
  ]) {
    assert.ok(indexHtml.includes(selector), `Missing UX hook: ${selector}`);
  }
});

test('Phase B: main.js handles navigation, document keydown + Alt guard, backdrop, error reset, focus restore, and clipboard failure', async () => {
  // 1) Insecure context keeps copy buttons hidden
  const insecure = runMainJsWithDom({ secureContext: false, clipboardImpl: { writeText: async () => {} } });
  assert.equal(insecure.emailBtn.hidden, true);
  assert.equal(insecure.codePairs[0].btn.hidden, true);
  assert.equal(insecure.codePairs[1].btn.hidden, true);

  // 2) Full happy path + document-level ArrowRight/ArrowLeft + Alt guard + Ctrl+click passthrough + prevBtn + backdrop + error reset
  const copied = [];
  const ctx = runMainJsWithDom({
    secureContext: true,
    clipboardImpl: { writeText: async (text) => { copied.push(text); } }
  });
  assert.equal(ctx.emailBtn.hidden, false);
  assert.equal(ctx.codePairs[0].btn.hidden, false);
  assert.equal(ctx.codePairs[1].btn.hidden, false);

  // Ctrl+click should NOT open modal or prevent default
  let preventedCtrl = false;
  ctx.triggers[0].dispatchEvent({ type: 'click', button: 0, ctrlKey: true, preventDefault() { preventedCtrl = true; } });
  assert.equal(preventedCtrl, false);
  assert.equal(ctx.dialog.open, false);

  // Normal click opens slide 2 and binds caption, alt, and direct fallback link
  ctx.triggers[1].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.dialog.open, true);
  assert.equal(ctx.counterEl.textContent, '2 / 3');
  assert.equal(ctx.captionEl.textContent, 'Caption 2');
  assert.equal(ctx.img.alt, 'Alt 2');
  assert.equal(ctx.directLink.getAttribute('href'), '/assets/screenshots/capstone-screen-2.webp');

  // Next button click advances slide 2 -> 3
  ctx.nextBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.counterEl.textContent, '3 / 3');
  assert.equal(ctx.captionEl.textContent, 'Caption 3');
  ctx.prevBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.counterEl.textContent, '2 / 3');

  // Error on slide 2 -> Prev -> resets to slide 1
  ctx.img.dispatchEvent({ type: 'error' });
  assert.equal(ctx.errorEl.hidden, false);
  ctx.prevBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.counterEl.textContent, '1 / 3');
  assert.equal(ctx.errorEl.hidden, true);
  assert.equal(ctx.img.hidden, false);

  // Document-level ArrowRight works even when focus leaves <dialog> (e.g. user clicked preview img)
  await ctx.mockDoc.dispatchEvent({ type: 'keydown', key: 'ArrowRight', preventDefault() {} });
  assert.equal(ctx.counterEl.textContent, '2 / 3');

  // Alt+ArrowLeft browser back shortcut must NOT hijack modal or preventDefault
  let altPrevented = false;
  await ctx.mockDoc.dispatchEvent({ type: 'keydown', key: 'ArrowLeft', altKey: true, preventDefault() { altPrevented = true; } });
  assert.equal(altPrevented, false);
  assert.equal(ctx.counterEl.textContent, '2 / 3');

  // ArrowLeft wraps cleanly 2 -> 1 -> 3
  await ctx.mockDoc.dispatchEvent({ type: 'keydown', key: 'ArrowLeft', preventDefault() {} });
  assert.equal(ctx.counterEl.textContent, '1 / 3');
  await ctx.mockDoc.dispatchEvent({ type: 'keydown', key: 'ArrowLeft', preventDefault() {} });
  assert.equal(ctx.counterEl.textContent, '3 / 3');

  // Close button closes dialog, clears img src, and restores focus to trigger (#2)
  ctx.closeBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.dialog.open, false);
  assert.equal(ctx.img.hasAttribute('src'), false);
  assert.equal(ctx.triggers[1].focusedCount, 1);

  // Reopen trigger (#2) and close via backdrop click
  ctx.triggers[1].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  ctx.dialog.dispatchEvent({ type: 'click', target: ctx.dialog });
  assert.equal(ctx.dialog.open, false);
  assert.equal(ctx.img.hasAttribute('src'), false);
  assert.equal(ctx.triggers[1].focusedCount, 2);

  // Clipboard writes (email + both code drawers)
  await ctx.emailBtn.dispatchEvent({ type: 'click' });
  await ctx.codePairs[0].btn.dispatchEvent({ type: 'click' });
  await ctx.codePairs[1].btn.dispatchEvent({ type: 'click' });
  assert.deepEqual(copied, ['Aronsarino435@gmail.com', 'snippet-1', 'snippet-2']);

  // 3) Rejected clipboard write surfaces polite error copy without throwing
  const failingCopy = runMainJsWithDom({
    secureContext: true,
    clipboardImpl: { writeText: async () => { throw new Error('Denied'); } }
  });
  await failingCopy.emailBtn.dispatchEvent({ type: 'click' });
  assert.match(failingCopy.emailStatus.textContent, /Copy unavailable/);
});

test('Phase 2: index.html presents Barangay II Población 5-app capstone, approved bio, and Cloud Firestore stack', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'index.html'), 'utf8');
  const notFoundHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', '404.html'), 'utf8');

  const approvedBio =
    'Jay-R Sarino is a 4th-year Bachelor of Science in Information Technology (BSIT) student at Binalbagan Catholic College with a strong focus on mobile, web, and embedded systems development. Serving as Project Manager and Lead Programmer, he spearheaded the development of multi-application platforms using Flutter, Firebase, and Google Maps API, alongside IoT prototypes powered by Arduino and ESP32. Combining hands-on software engineering with strong problem-solving and system architecture skills, he builds practical, community-driven digital solutions designed for reliability and real-world impact.';

  const requiredPhrases = [
    'Jay-R Sarino',
    approvedBio,
    'Binalbagan Catholic College',
    'Project Manager and Lead Programmer',
    'Arduino',
    'ESP32',
    'Android-Based Smartphone Barangay Service Portal with Appointment Management for Improved Communication',
    'Barangay II Población, Pontevedra, Negros Occidental',
    'Resident Mobile App',
    'Barangay Admin App',
    'Tanod Admin',
    'Tanod / Field Patroller App',
    'Healthcare Admin App',
    'Cloud Firestore',
    'Firebase Authentication',
    'Firebase Cloud Storage',
    'Firebase Cloud Messaging',
    'Google Maps',
    'Rule-Based Validation',
    'firestore.rules',
    'FirebaseFirestore',
    "resource.data.residentId == request.auth.uid",
    "hasRole('resident')",
    "'Arrived'",
    "'Investigating'"
  ];

  for (const phrase of requiredPhrases) {
    assert.ok(indexHtml.includes(phrase), `index.html must include "${phrase}"`);
  }

  assert.equal(indexHtml.includes('Jay-r Sarino'), false, 'index.html must standardize naming to Jay-R Sarino');
  assert.ok(notFoundHtml.includes('Jay-R Sarino'), '404.html must include Jay-R Sarino');
  assert.equal(notFoundHtml.includes('Jay-r Sarino'), false, '404.html must standardize naming to Jay-R Sarino');

  // Ensure RBAC rules scope both /incidents and /appointments reads by ownership/role (no open auth != null read on appointments)
  assert.equal(/match \/appointments\/\{apptId\}[\s\S]*?allow read, create: if request\.auth != null;/.test(indexHtml), false, 'firestore.rules /appointments read must check resident ownership or healthcare/barangay role');
  assert.equal(/match \/incidents\/\{incidentId\}[\s\S]*?allow read: if request\.auth != null;/.test(indexHtml), false, 'firestore.rules /incidents read must check resident ownership or responder role');

  // Verify SVG badge pills & inner boxes avoid text clipping
  assert.match(indexHtml, /<rect x="24" y="28" width="144" height="22"/, 'SVG stage 1 pill must have >=144px width for 1 · DESIGN & GUARDS');
  assert.match(indexHtml, /<rect x="284" y="28" width="176" height="22"/, 'SVG stage 2 pill must have >=176px width for 2 · 5 FLUTTER APPS (DART)');
  assert.equal(indexHtml.includes('Evidence Media &amp; Dispatch Alerts'), false, 'SVG inner box 3 text must fit comfortably inside 162px width');

  assert.equal(/Firebase Realtime Database/i.test(indexHtml), false, 'index.html must not contain stale Firebase Realtime Database copy');
  assert.equal(/database\.rules\.json/i.test(indexHtml), false, 'index.html must not reference database.rules.json');
  assert.equal(/\bDatabaseEvent\b|\bDatabaseReference\b/.test(indexHtml), false, 'index.html must not reference RTDB Dart types');
});

test('Phase 2: docs/designs/portfolio.md reflects Cloud Firestore, 5-app Barangay scope, and zero RTDB drift', () => {
  const specDoc = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'designs', 'portfolio.md'), 'utf8');

  const requiredSpecPhrases = [
    'Android-Based Smartphone Barangay Service Portal with Appointment Management for Improved Communication',
    'Barangay II Población, Pontevedra, Negros Occidental',
    'Resident Mobile App',
    'Barangay Admin App',
    'Tanod Admin',
    'Tanod / Field Patroller App',
    'Healthcare Admin App',
    'Google Maps',
    'Rule-Based Validation',
    'Cloud Firestore',
    'Firebase Authentication',
    'Firebase Cloud Messaging',
    'firestore.rules',
    'https://github.com/donaron',
    'Aronsarino435@gmail.com'
  ];

  for (const phrase of requiredSpecPhrases) {
    assert.ok(specDoc.includes(phrase), `docs/designs/portfolio.md must include "${phrase}"`);
  }

  assert.equal(/Firebase Realtime Database/i.test(specDoc), false, 'docs/designs/portfolio.md must not mention Firebase Realtime Database');
  assert.equal(/database\.rules\.json/i.test(specDoc), false, 'docs/designs/portfolio.md must not mention database.rules.json');
  assert.equal(/\.onValue\b/.test(specDoc), false, 'docs/designs/portfolio.md must not reference .onValue');
});

test('Phase 2: compiled Tailwind CSS meets strict <= 30,000 byte budget', () => {
  const tmpOut = path.join(os.tmpdir(), `portfolio-css-budget-${process.pid}.css`);
  const cliEntry = path.join(ROOT_DIR, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
  const inputCss = path.join(ROOT_DIR, 'src', 'styles', 'input.css');
  try {
    execFileSync(process.execPath, [cliEntry, '-i', inputCss, '-o', tmpOut, '--minify'], {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    });
    const cssBytes = fs.statSync(tmpOut).size;
    assert.ok(cssBytes > 1_000 && cssBytes <= 30_000, `Compiled CSS size ${cssBytes} bytes exceeds 30,000 byte budget`);
  } finally {
    fs.rmSync(tmpOut, { force: true });
  }
});

test('Phase 3: Design 15 Amethyst Dusk & Teal applied across CSS, HTML, SVG, 404, and spec with zero light-card leaks', () => {
  const inputCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'styles', 'input.css'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', 'index.html'), 'utf8');
  const notFoundHtml = fs.readFileSync(path.join(ROOT_DIR, 'src', '404.html'), 'utf8');
  const specDoc = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'designs', 'portfolio.md'), 'utf8');

  for (const token of ['#0f0720', '#f5f3ff', '#5eead4', '#8b5cf6', 'color-scheme: dark;', '.hero-backdrop', '.header-dusk', '.card-dusk', '.tile-dusk', '.btn-dusk', '.band-dusk', '.tray-dusk', '.code-dusk']) {
    assert.ok(inputCss.includes(token), `input.css missing Design 15 token: ${token}`);
  }
  assert.equal(inputCss.includes('#f8fafc'), false, 'input.css must replace light #f8fafc base background');
  assert.equal(inputCss.includes('#1d4ed8'), false, 'input.css must replace old cobalt #1d4ed8 focus ring');

  for (const cls of ['card-dusk', 'tile-dusk', 'btn-dusk', 'band-dusk', 'tray-dusk', 'code-dusk', 'bg-fuchsia-400', 'text-violet-50']) {
    assert.ok(indexHtml.includes(cls), `index.html missing Design 15 class: ${cls}`);
  }
  assert.equal(/\bbg-slate-50\b|\btext-slate-900\b/.test(indexHtml), false, 'index.html must not retain light-mode slate-50 / text-slate-900 classes');
  assert.equal(/<(?!img\b)[a-z0-9-]+\b[^>]*\bbg-white\b/i.test(indexHtml), false, 'index.html non-img elements must not stay bg-white in dark mode');

  const svgMatch = indexHtml.match(/<svg viewBox="0 0 760 208"[\s\S]*?<\/svg>/);
  assert.ok(svgMatch, 'System architecture SVG missing');
  assert.ok(svgMatch[0].includes('#e879f9') && svgMatch[0].includes('#2dd4bf'), 'Architecture SVG must use Design 15 fuchsia/teal accents');
  assert.equal(/fill="#(0f172a|ffffff)"/i.test(svgMatch[0]), false, 'Architecture SVG must use dark Dusk card/text fills');

  assert.ok(notFoundHtml.includes('card-dusk') && notFoundHtml.includes('btn-dusk') && notFoundHtml.includes('text-violet-50') && notFoundHtml.includes('bg-fuchsia-400'), '404.html must apply Design 15 dark styling');
  assert.equal(/\bbg-slate-50\b|\bbg-white\b|\btext-slate-900\b/.test(notFoundHtml), false, '404.html must not retain light surface/ink classes');

  assert.ok(specDoc.includes('Amethyst Dusk') && specDoc.includes('#0f0720') && specDoc.includes('#e879f9') && specDoc.includes('.btn-dusk'), 'docs/designs/portfolio.md must reflect Amethyst Dusk palette');
  assert.equal(specDoc.includes('#f8fafc') || specDoc.includes('#1d4ed8') || specDoc.includes('dark-slate'), false, 'docs/designs/portfolio.md must not retain old light cobalt or dark-slate copy');
});

test('Phase 4: main.js isolates data-lightbox-group galleries and hides Prev/Next on single certificate', async () => {
  const ctx = runMainJsWithDom({ grouped: true });

  // Open capstone slide 1 -> only 3 items in capstone group, Prev/Next visible
  ctx.triggers[0].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.counterEl.textContent, '1 / 3');
  assert.equal(ctx.prevBtn.hidden, false);
  assert.equal(ctx.nextBtn.hidden, false);
  ctx.closeBtn.dispatchEvent({ type: 'click' });

  // Open singleton DevFest certificate -> 1 / 1, Prev/Next hidden, ArrowRight ignored
  ctx.triggers[3].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.dialog.open, true);
  assert.equal(ctx.counterEl.textContent, '1 / 1');
  assert.equal(ctx.captionEl.textContent, 'DevFest Bacolod 2025');
  assert.equal(ctx.prevBtn.hidden, true);
  assert.equal(ctx.nextBtn.hidden, true);
  await ctx.mockDoc.dispatchEvent({ type: 'keydown', key: 'ArrowRight', preventDefault() {} });
  assert.equal(ctx.counterEl.textContent, '1 / 1');
  ctx.closeBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.triggers[3].focusedCount, 1);
});

test('Phase 4: DevFest Bacolod 2025 & OPSWAT ICIP Certificates, clean JPEG assets, cache header, and nav/spec wiring', async () => {
  const indexHtml = readSrc('src/index.html');
  const headers = readSrc('src/_headers');
  const specDoc = readSrc('docs/designs/portfolio.md');
  const buildSrc = readSrc('scripts/build.mjs');
  const devfestPath = path.join(ROOT_DIR, 'src', 'assets', 'certificates', 'devfest-bacolod-2025.jpg');
  const opswatPath = path.join(ROOT_DIR, 'src', 'assets', 'certificates', 'opswat-icip-2026.jpg');

  const { assertCleanJpeg } = await loadBuildHelpers();
  for (const [label, certPath] of [['devfest-bacolod-2025.jpg', devfestPath], ['opswat-icip-2026.jpg', opswatPath]]) {
    assert.ok(fs.existsSync(certPath), `Missing certificate asset at src/assets/certificates/${label}`);
    assertCleanJpeg(certPath);
    assert.ok(fs.statSync(certPath).size <= 200_000, `${label} must stay <= 200,000 bytes`);
  }

  assert.ok(buildSrc.includes('certificates'), 'build.mjs must handle certificates directory cleanly');
  assert.ok(headers.includes('/assets/certificates/*'), '_headers must configure caching for /assets/certificates/*');

  const certSectionMatch = indexHtml.match(/<section[^>]*id="certificates"[\s\S]*?<\/section>/i);
  assert.ok(certSectionMatch, 'index.html missing #certificates section');
  const certSec = certSectionMatch[0];
  for (const phrase of [
    'DevFest Bacolod 2025',
    'Certificate of Attendance',
    'Google Developer Groups Bacolod',
    'November 22, 2025',
    'University of St. La Salle',
    'Dave Celo',
    '/assets/certificates/devfest-bacolod-2025.jpg',
    'width="1024"',
    'height="723"',
    'Introduction to Critical Infrastructure Protection',
    'OPSWAT Academy',
    '0.50',
    'k1uxD4krPw',
    'November 18, 2026',
    'November 18, 2027',
    'Benny Czarny',
    'Irfan Shakeel',
    'https://learn.opswatacademy.com/certificate/k1uxD4krPw',
    '/assets/certificates/opswat-icip-2026.jpg',
    'width="900"',
    'height="710"'
  ]) {
    assert.ok(certSec.includes(phrase), `#certificates section missing "${phrase}"`);
  }
  assert.equal([...certSec.matchAll(/data-lightbox-group="certificates"/g)].length, 2, 'Certificates lightbox group should include both real certificates');
  assert.equal(/\bdata-owner-draft\b/i.test(certSec), false, 'Real certificates must not be marked data-owner-draft');

  // Capstone screens must isolate under data-lightbox-group="capstone"
  assert.equal([...indexHtml.matchAll(/data-lightbox-group="capstone"/g)].length, EXPECTED_CAPSTONE_SCREENS.length);

  // Primary nav and footer link to #certificates cleanly
  const navMatch = indexHtml.match(/<nav[\s\S]*?<\/nav>/i);
  const footerMatch = indexHtml.match(/<footer[\s\S]*?<\/footer>/i);
  assert.ok(navMatch && navMatch[0].includes('href="#certificates"'), 'Primary <nav> must link to #certificates');
  assert.ok(footerMatch && footerMatch[0].includes('href="#certificates"'), '<footer> must link to #certificates');

  assert.ok(
    specDoc.includes('certificates') &&
      specDoc.includes('DevFest Bacolod 2025') &&
      specDoc.includes('Introduction to Critical Infrastructure Protection'),
    'docs/designs/portfolio.md must document both Certificates'
  );
});

test('Phase 5: BarangayConnect 6 real dashboard previews, asset cleanup, gallery wiring, and spec update', () => {
  const indexHtml = readSrc('src/index.html');
  const specDoc = readSrc('docs/designs/portfolio.md');
  const screenshotsDir = path.join(ROOT_DIR, 'src', 'assets', 'screenshots');
  const certsDir = path.join(ROOT_DIR, 'src', 'assets', 'certificates');

  const actualFiles = fs.readdirSync(screenshotsDir).sort();
  assert.deepEqual(
    actualFiles,
    EXPECTED_CAPSTONE_SCREENS.map((s) => s.file),
    'src/assets/screenshots must contain only the 6 real BarangayConnect WebP dashboards'
  );
  for (const stale of ['capstone-screen-1.webp', 'capstone-screen-2.webp', 'capstone-screen-3.webp']) {
    assert.equal(actualFiles.includes(stale), false, `Stale synthetic fixture ${stale} should be removed`);
  }

  let galleryBytes = 0;
  for (const name of actualFiles) {
    galleryBytes += fs.statSync(path.join(screenshotsDir, name)).size;
  }
  for (const name of fs.readdirSync(certsDir)) {
    galleryBytes += fs.statSync(path.join(certsDir, name)).size;
  }
  assert.ok(galleryBytes <= 2_500_000, `Total gallery + certificates (${galleryBytes} B) exceeds 2,500,000 B`);

  const capstoneMatch = indexHtml.match(/<section[^>]*id="capstone"[\s\S]*?<\/section>/i);
  assert.ok(capstoneMatch, 'index.html missing #capstone section');
  const capstoneSec = capstoneMatch[0];
  assert.equal(/<figure\b[^>]*data-owner-draft\b/i.test(capstoneSec), false, '#capstone dashboard figures must not carry data-owner-draft');
  assert.equal(/capstone-screen-\d+\.webp/i.test(capstoneSec), false, '#capstone must not reference old capstone-screen-* fixtures');

  for (const spec of EXPECTED_CAPSTONE_SCREENS) {
    assert.ok(capstoneSec.includes(`/assets/screenshots/${spec.file}`), `#capstone missing /assets/screenshots/${spec.file}`);
    assert.ok(capstoneSec.includes(`width="${spec.w}"`) && capstoneSec.includes(`height="${spec.h}"`), `#capstone missing dimensions ${spec.w}x${spec.h}`);
    assert.ok(capstoneSec.includes(spec.phrase), `#capstone missing dashboard detail "${spec.phrase}"`);
  }

  assert.ok(
    specDoc.includes('01-main-gate-dashboard.webp') &&
      specDoc.includes('06-tanod-field-dashboard.webp') &&
      specDoc.includes('6-screen'),
    'docs/designs/portfolio.md must reflect the 6 verified BarangayConnect dashboard previews'
  );
});

test('Phase 6: main.js renders right-side application workflow details for documented screens and hides panel when empty', () => {
  const ctx = runMainJsWithDom({ grouped: true, withDetails: true });

  // Open capstone screen 1 -> right-side panel becomes visible with 3 clean <li> features
  ctx.triggers[0].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.detailsEl.hidden, false, 'Details panel should show when slide provides workflow features');
  assert.equal(ctx.titleEl.textContent, 'App 1 Title');
  assert.equal(ctx.roleEl.textContent, 'Target Users: Role 1');
  assert.equal(ctx.summaryEl.textContent, 'Summary 1');
  assert.equal(ctx.stackEl.textContent, 'Flutter · Cloud Firestore 1');
  assert.equal(ctx.featuresEl.children.length, 3);
  assert.equal(ctx.featuresEl.children[0].children[1].textContent, 'Feature 1A');

  // Next slide replaces previous feature list cleanly (no duplicate nodes accumulated)
  ctx.nextBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.titleEl.textContent, 'App 2 Title');
  assert.equal(ctx.featuresEl.children.length, 3);
  assert.equal(ctx.featuresEl.children[2].children[1].textContent, 'Feature 2C');

  // Close resets details panel back to hidden and clears feature items
  ctx.closeBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.detailsEl.hidden, true);
  assert.equal(ctx.titleEl.textContent, '');
  assert.equal(ctx.featuresEl.children.length, 0);

  // Also confirm trigger 0 attributes & DOM content stay intact after opening modal
  assert.equal(ctx.triggers[0].children.length, 0, 'Trigger anchor must never have modal features appended into it');
  // Opening a certificate without data-lightbox-features keeps right-side panel hidden
  ctx.triggers[3].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.detailsEl.hidden, true);
});

test('Phase 6: index.html and docs/designs/portfolio.md document right-side how-it-works panels from capstone markdown', () => {
  const indexHtml = readSrc('src/index.html');
  const mainJs = readSrc('src/scripts/main.js');
  const specDoc = readSrc('docs/designs/portfolio.md');

  assert.equal(/\binnerHTML\b/i.test(mainJs), false);
  assert.ok(Buffer.byteLength(mainJs, 'utf8') <= 15_000, 'main.js must remain <= 15,000 bytes');

  const dialogMatch = indexHtml.match(/<dialog[\s\S]*?<\/dialog>/i);
  assert.ok(dialogMatch, 'Missing lightbox <dialog>');
  for (const hook of [
    'data-lightbox-details',
    'data-lightbox-panel-title',
    'data-lightbox-panel-role',
    'data-lightbox-panel-summary',
    'data-lightbox-panel-features',
    'data-lightbox-panel-stack'
  ]) {
    assert.ok(dialogMatch[0].includes(hook), `<dialog> missing ${hook}`);
  }

  const capstoneAnchors = [...indexHtml.matchAll(/<a\b[^>]*data-lightbox-group="capstone"[^>]*>/gi)].map((m) => m[0]);
  assert.equal(capstoneAnchors.length, 6, 'Expected 6 capstone lightbox anchors');
  for (const anchor of capstoneAnchors) {
    assert.match(anchor, /data-lightbox-title="[^"]+"/);
    assert.match(anchor, /data-lightbox-role="[^"]+"/);
    assert.match(anchor, /data-lightbox-summary="[^"]+"/);
    const featMatch = anchor.match(/data-lightbox-features="([^"]+)"/i);
    assert.ok(featMatch, `Anchor missing data-lightbox-features: ${anchor}`);
    assert.equal(featMatch[1].split('|').filter(Boolean).length, 4, 'Each capstone screen should expose 4 structured workflow bullets');
    assert.match(anchor, /data-lightbox-stack="[^"]+"/);
  }

  for (const phrase of [
    'Registered Residents of Barangay II Población',
    'Barangay Captain, Secretary &amp; Executive Officials',
    'Barangay Health Workers (BHWs) &amp; Midwives',
    'Chief Tanod &amp; Barangay Peace and Order Officers',
    'On-Duty Barangay Tanods',
    'Rule-Based',
    'Assigned → En Route → Arrived → Investigating → Resolved'
  ]) {
    assert.ok(capstoneAnchors.some((a) => a.includes(phrase)), `Missing documented workflow phrase "${phrase}" across capstone triggers`);
  }

  assert.ok(
    specDoc.includes('How It Works') && specDoc.includes('data-lightbox-details'),
    'docs/designs/portfolio.md must document the right-side How It Works lightbox workflow panel'
  );
});

test('Phase 7: main.js customizes right-side headings and verification button for certificates', () => {
  const ctx = runMainJsWithDom({ grouped: true, withDetails: true, withCertDetails: true });

  // Open capstone slide -> uses default How It Works labels and keeps Verify Certificate button hidden
  ctx.triggers[0].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.eyebrowEl.textContent, 'How It Works');
  assert.equal(ctx.featuresLabelEl.textContent, 'Core Application Workflow');
  assert.equal(ctx.stackLabelEl.textContent, 'Stack & Cloud Integration');
  assert.equal(ctx.verifyEl.hidden, true);
  ctx.closeBtn.dispatchEvent({ type: 'click' });

  // Open DevFest certificate -> shows Verified Credential details without external verify button
  ctx.triggers[3].dispatchEvent({ type: 'click', button: 0, preventDefault() {} });
  assert.equal(ctx.detailsEl.hidden, false);
  assert.equal(ctx.counterEl.textContent, '1 / 2');
  assert.equal(ctx.eyebrowEl.textContent, 'Verified Credential');
  assert.equal(ctx.titleEl.textContent, 'Google DevFest Bacolod 2025');
  assert.equal(ctx.featuresLabelEl.textContent, 'Credential Details');
  assert.equal(ctx.stackLabelEl.textContent, 'Credential Format');
  assert.equal(ctx.featuresEl.children.length, 4);
  assert.equal(ctx.verifyEl.hidden, true);

  // Next -> OPSWAT ICIP reveals external Verify Certificate link
  ctx.nextBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.counterEl.textContent, '2 / 2');
  assert.equal(ctx.titleEl.textContent, 'Introduction to Critical Infrastructure Protection');
  assert.equal(ctx.stackLabelEl.textContent, 'Verification Record');
  assert.equal(ctx.verifyEl.hidden, false);
  assert.equal(ctx.verifyEl.getAttribute('href'), 'https://learn.opswatacademy.com/certificate/k1uxD4krPw');

  // Close resets verify button and defaults
  ctx.closeBtn.dispatchEvent({ type: 'click' });
  assert.equal(ctx.detailsEl.hidden, true);
  assert.equal(ctx.verifyEl.hidden, true);
  assert.equal(ctx.verifyEl.getAttribute('href'), '#');
});

test('Phase 7: both certificate modal triggers and dialog expose Verified Credential right-side details', () => {
  const indexHtml = readSrc('src/index.html');
  const dialogMatch = indexHtml.match(/<dialog[\s\S]*?<\/dialog>/i);
  assert.ok(dialogMatch);
  for (const hook of [
    'data-lightbox-panel-eyebrow',
    'data-lightbox-panel-features-label',
    'data-lightbox-panel-stack-label',
    'data-lightbox-verify'
  ]) {
    assert.ok(dialogMatch[0].includes(hook), `<dialog> missing ${hook}`);
  }

  const certAnchors = [...indexHtml.matchAll(/<a\b[^>]*data-lightbox-group="certificates"[^>]*>/gi)].map((m) => m[0]);
  assert.equal(certAnchors.length, 2, 'Expected 2 certificate lightbox triggers');
  for (const anchor of certAnchors) {
    assert.match(anchor, /data-lightbox-eyebrow="Verified Credential"/);
    assert.match(anchor, /data-lightbox-title="[^"]+"/);
    assert.match(anchor, /data-lightbox-role="[^"]+"/);
    assert.match(anchor, /data-lightbox-summary="[^"]+"/);
    assert.match(anchor, /data-lightbox-features-label="Credential Details"/);
    const featMatch = anchor.match(/data-lightbox-features="([^"]+)"/i);
    assert.ok(featMatch && featMatch[1].split('|').filter(Boolean).length === 4, 'Certificate modal must expose 4 Credential Details bullets');
    assert.match(anchor, /data-lightbox-stack-label="[^"]+"/);
    assert.match(anchor, /data-lightbox-stack="[^"]+"/);
  }
  assert.match(certAnchors[1], /data-lightbox-verify="https:\/\/learn\.opswatacademy\.com\/certificate\/k1uxD4krPw"/);
});

test('Phase 8: hero portrait photo, self-hosted CV PDF, LinkedIn removal, build/preview/headers & spec wiring', async () => {
  const indexHtml = readSrc('src/index.html');
  const headers = readSrc('src/_headers');
  const buildSrc = readSrc('scripts/build.mjs');
  const previewSrc = readSrc('scripts/preview.mjs');
  const specDoc = readSrc('docs/designs/portfolio.md');

  const portraitPath = path.join(ROOT_DIR, 'src', 'assets', 'jayr-sarino.webp');
  const cvPath = path.join(ROOT_DIR, 'src', 'assets', 'jayr-sarino-cv.pdf');
  const { assertCleanWebp } = await loadBuildHelpers();

  assert.ok(fs.existsSync(portraitPath), 'Missing portrait WebP at src/assets/jayr-sarino.webp');
  assertCleanWebp(portraitPath);
  const portraitBuf = fs.readFileSync(portraitPath);
  assert.ok(portraitBuf.length > 5_000 && portraitBuf.length <= 200_000, `jayr-sarino.webp size ${portraitBuf.length} outside budget`);
  assert.deepEqual(readWebpDimensions(portraitBuf), { codec: 'VP8 ', w: 765, h: 1024 });

  assert.ok(fs.existsSync(cvPath), 'Missing CV PDF at src/assets/jayr-sarino-cv.pdf');
  const cvBuf = fs.readFileSync(cvPath);
  assert.equal(cvBuf.subarray(0, 5).toString('ascii'), '%PDF-', 'jayr-sarino-cv.pdf must start with %PDF-');
  assert.ok(cvBuf.length > 5_000 && cvBuf.length <= 1_000_000, `jayr-sarino-cv.pdf size ${cvBuf.length} outside <= 1MB budget`);

  assert.ok(buildSrc.includes('jayr-sarino.webp') && buildSrc.includes('jayr-sarino-cv.pdf'), 'build.mjs must handle portrait WebP and CV PDF');
  assert.ok(previewSrc.includes("'.pdf': 'application/pdf'"), 'preview.mjs must serve .pdf with application/pdf');
  assert.ok(headers.includes('/assets/jayr-sarino.webp') && headers.includes('/assets/*.pdf') && headers.includes("object-src 'self'"), '_headers must configure caching and inline PDF CSP');

  const aboutMatch = indexHtml.match(/<section[^>]*id="about"[\s\S]*?<\/section>/i);
  assert.ok(aboutMatch, 'Missing #about section');
  assert.ok(
    aboutMatch[0].includes('/assets/jayr-sarino.webp') &&
      aboutMatch[0].includes('width="765"') &&
      aboutMatch[0].includes('height="1024"'),
    '#about hero must render /assets/jayr-sarino.webp with explicit 765x1024 dimensions'
  );

  const cvLinks = [...indexHtml.matchAll(/<a\b[^>]*href="\/assets\/jayr-sarino-cv\.pdf"[^>]*>/gi)].map((m) => m[0]);
  assert.equal(cvLinks.length, 3, 'Header, Hero, and Contact CV buttons should all link to /assets/jayr-sarino-cv.pdf');
  for (const link of cvLinks) {
    assert.match(link, /target="_blank"/);
    assert.match(link, /rel="noopener noreferrer"/);
  }

  const contactMatch = indexHtml.match(/<section[^>]*id="contact"[\s\S]*?<\/section>/i);
  assert.ok(contactMatch);
  assert.equal(/linkedin/i.test(contactMatch[0]), false, '#contact must not contain LinkedIn');
  assert.equal(/example\.invalid/i.test(indexHtml), false, 'index.html must contain zero example.invalid placeholders');

  assert.ok(
    specDoc.includes('jayr-sarino.webp') && specDoc.includes('jayr-sarino-cv.pdf'),
    'docs/designs/portfolio.md must document hero portrait and bundled CV PDF'
  );
});

test('Phase 9: vercel.json configures static dist build, CSP/cache headers, and release build readiness', () => {
  const vercelPath = path.join(ROOT_DIR, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'Missing vercel.json at repository root');
  const vercelCfg = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  assert.equal(vercelCfg.framework, null);
  assert.equal(vercelCfg.buildCommand, 'npm run build:release');
  assert.equal(vercelCfg.outputDirectory, 'dist');
  assert.equal(vercelCfg.cleanUrls, true);
  assert.ok(Array.isArray(vercelCfg.headers) && vercelCfg.headers.length >= 4, 'vercel.json must configure security and cache headers');
  const headerJson = JSON.stringify(vercelCfg.headers);
  for (const needle of ['Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', "object-src 'none'", "object-src 'self'"]) {
    assert.ok(headerJson.includes(needle), `vercel.json headers missing "${needle}"`);
  }

  const specDoc = readSrc('docs/designs/portfolio.md');
  assert.ok(specDoc.includes('vercel.json'), 'docs/designs/portfolio.md must document vercel.json');
});

test('Phase 10: #github Profile Card showcases @donaron and all 6 public GitHub repositories safely', () => {
  const indexHtml = readSrc('src/index.html');
  const specDoc = readSrc('docs/designs/portfolio.md');

  const githubMatch = indexHtml.match(/<section[^>]*id="github"[\s\S]*?<\/section>/i);
  assert.ok(githubMatch, 'index.html missing #github section');
  const githubSec = githubMatch[0];

  const sectionTag = githubSec.match(/<section[^>]*id="github"[^>]*class="([^"]*)"/i);
  assert.ok(sectionTag, '#github section missing class attribute');
  assert.match(sectionTag[1], /\bmd:scroll-mt-24\b/, '#github requires md:scroll-mt-24');
  assert.equal(/\bsm:scroll-mt-\d+\b/.test(sectionTag[1]), false, '#github must not duplicate sm:scroll-mt-*');
  assert.equal(/\bdata-owner-draft\b/i.test(githubSec), false, '#github must not contain data-owner-draft markers');

  const navMatch = indexHtml.match(/<nav[^>]*aria-label="Primary"[\s\S]*?<\/nav>/i);
  const footerMatch = indexHtml.match(/<footer[\s\S]*?<\/footer>/i);
  assert.ok(navMatch && navMatch[0].includes('href="#github"'), 'Primary <nav> must link to #github');
  assert.ok(footerMatch && footerMatch[0].includes('href="#github"'), '<footer> must link to #github');

  for (const profileToken of [
    '/assets/jayr-sarino.webp',
    'width="765"',
    'height="1024"',
    'loading="lazy"',
    'Don Aron',
    '@donaron',
    'a mobile app developer',
    'https://github.com/donaron',
    '6 Public Repositories'
  ]) {
    assert.ok(githubSec.includes(profileToken), `#github Profile Card missing "${profileToken}"`);
  }

  const publicRepos = [
    ['donaron-plugin', 'https://github.com/donaron/donaron-plugin', 'TypeScript'],
    ['soundwave-drop', 'https://github.com/donaron/soundwave-drop', 'Python'],
    ['barangay-connect-releases', 'https://github.com/donaron/barangay-connect-releases', 'BarangayConnect Official Signed Android APK Releases'],
    ['jayr-sarino-portfolio', 'https://github.com/donaron/jayr-sarino-portfolio', 'JavaScript'],
    ['Bccporfolio', 'https://github.com/donaron/Bccporfolio', 'CSS'],
    ['barangay-app-repository', 'https://github.com/donaron/barangay-app-repository', 'mobile app for barangay']
  ];

  for (const [name, url, detail] of publicRepos) {
    assert.ok(githubSec.includes(name), `#github missing repo name: ${name}`);
    assert.ok(githubSec.includes(`href="${url}"`), `#github missing repo link: ${url}`);
    assert.ok(githubSec.includes(detail), `#github missing verified detail "${detail}" for ${name}`);
    assert.ok(specDoc.includes(name), `docs/designs/portfolio.md must document GitHub repo ${name}`);
  }

  for (const tag of githubSec.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    assert.match(tag[0], /rel="noopener noreferrer"/, `External GitHub link missing safe rel: ${tag[0]}`);
  }

  assert.equal(indexHtml.includes('github.com/donaron/barangay-connect"'), false, 'Private barangay-connect repository URL must never be linked publicly');
  assert.ok(specDoc.includes('#github'), 'docs/designs/portfolio.md must document the #github Profile Card section');
});
