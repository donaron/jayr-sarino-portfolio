/**
 * Builds ./dist/ from ./src/ with strict casing, metadata-stripping,
 * origin/placeholder validation (--release), Tailwind CLI minification, and byte budgets.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');
const DIST_SCREENSHOTS_DIR = path.join(DIST_ASSETS_DIR, 'screenshots');
const DIST_CERTIFICATES_DIR = path.join(DIST_ASSETS_DIR, 'certificates');

const ALLOWED_ROOT_FILES = new Set(['index.html', '404.html', 'robots.txt', '_headers']);
const ALLOWED_ROOT_DIRS = new Set(['assets', 'scripts', 'styles']);
const DIR_NAME_RE = /^[a-z0-9-]+$/;
const ASSET_FILE_RE = /^[a-z0-9-]+(\.[a-z0-9]+)+$/;

const BUDGETS = {
  landingTotalMax: 1_000_000,
  cssMax: 30_000,
  jsMax: 15_000,
  screenshotMax: 200_000,
  certificateMax: 200_000,
  portraitMax: 200_000,
  cvPdfMax: 1_000_000,
  galleryTotalMax: 2_500_000,
  ogPreviewMax: 150_000
};

function fail(message) {
  throw new Error(`Build validation failed: ${message}`);
}

export function resolveSiteUrl(isRelease, raw = process.env.SITE_URL) {
  if (!isRelease) {
    return (raw && raw.trim() ? raw.trim() : 'http://127.0.0.1:4173').replace(/\/+$/, '');
  }

  if (!raw || !raw.trim()) {
    fail('--release requires SITE_URL to be set (e.g. https://portfolio.example.com).');
  }

  let parsed;
  try {
    parsed = new URL(raw.trim());
  } catch {
    fail(`Invalid SITE_URL in --release mode: "${raw}".`);
  }

  if (parsed.protocol !== 'https:') {
    fail(`--release SITE_URL must use https:// (got "${parsed.protocol}").`);
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.localhost') ||
    host.endsWith('.invalid')
  ) {
    fail(`--release SITE_URL cannot target loopback or placeholder hostnames (got "${host}").`);
  }

  if (parsed.pathname !== '/' && parsed.pathname !== '') {
    fail(`--release SITE_URL must be a domain root without a subpath (got "${parsed.pathname}").`);
  }

  if (parsed.search || parsed.hash) {
    fail('--release SITE_URL must not contain query parameters or fragments.');
  }

  return parsed.origin;
}

export function validateSubtree(dirPath, isRoot = false) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!DIR_NAME_RE.test(entry.name)) {
        fail(`Invalid directory casing/name "${fullPath}" (must match ${DIR_NAME_RE}).`);
      }
      if (isRoot && !ALLOWED_ROOT_DIRS.has(entry.name)) {
        fail(`Unexpected root ./src directory "${entry.name}".`);
      }
      validateSubtree(fullPath, false);
    } else if (entry.isFile()) {
      if (isRoot) {
        if (!ALLOWED_ROOT_FILES.has(entry.name)) {
          fail(`Unexpected root ./src file "${entry.name}".`);
        }
      } else if (!ASSET_FILE_RE.test(entry.name)) {
        fail(`Invalid filename "${fullPath}" (must match ${ASSET_FILE_RE}).`);
      }
    } else {
      fail(`Unsupported filesystem entry "${fullPath}".`);
    }
  }
}

export function assertCleanWebp(filePath) {
  const buf = fs.readFileSync(filePath);
  if (
    buf.length < 12 ||
    buf.toString('ascii', 0, 4) !== 'RIFF' ||
    buf.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    fail(`${filePath} is not a valid RIFF/WEBP image.`);
  }

  const declaredRiffSize = buf.readUInt32LE(4);
  if (declaredRiffSize < 4 || declaredRiffSize + 8 > buf.length) {
    fail(`${filePath} has invalid or truncated RIFF payload.`);
  }

  let offset = 12;
  const end = declaredRiffSize + 8;
  let hasImageChunk = false;
  while (offset + 8 <= end) {
    const fourCC = buf.toString('ascii', offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    const paddedSize = chunkSize + (chunkSize & 1);
    if (offset + 8 + chunkSize > end) {
      fail(`${filePath} contains truncated chunk "${fourCC}".`);
    }
    if (fourCC === 'EXIF' || fourCC === 'XMP ' || fourCC === 'XMP\0') {
      fail(`${filePath} contains disallowed "${fourCC.trim()}" metadata chunk.`);
    }
    if (fourCC === 'VP8 ' || fourCC === 'VP8L') {
      hasImageChunk = true;
    }
    offset += 8 + paddedSize;
  }

  if (!hasImageChunk) {
    fail(`${filePath} missing VP8/VP8L image chunk.`);
  }
}

export function assertCleanJpeg(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    fail(`${filePath} is not a valid JPEG (missing SOI marker).`);
  }

  let offset = 2;
  while (offset < buf.length) {
    let sawPrefix = false;
    while (offset < buf.length && buf[offset] === 0xff) {
      sawPrefix = true;
      offset += 1;
    }
    if (!sawPrefix) {
      fail(`${filePath} missing 0xFF marker prefix at offset ${offset}.`);
    }
    if (offset >= buf.length) {
      break;
    }

    const marker = buf[offset];
    offset += 1;

    if (marker === 0x00) {
      continue;
    }
    if (marker === 0xda) {
      // Stop at SOS so entropy-coded image bytes are never inspected as markers.
      return;
    }
    if (marker === 0xd9) {
      fail(`${filePath} reached EOI before SOS.`);
    }
    if ((marker >= 0xe1 && marker <= 0xef) || marker === 0xfe) {
      const label = marker === 0xe1 ? 'APP1' : marker === 0xed ? 'APP13' : marker === 0xfe ? 'COM' : `APP${marker - 0xe0}`;
      fail(`${filePath} contains disallowed ${label} metadata segment.`);
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      continue;
    }
    if (offset + 2 > buf.length) {
      fail(`${filePath} truncated reading segment length at marker 0x${marker.toString(16)}.`);
    }
    const segLen = buf.readUInt16BE(offset);
    if (segLen < 2 || offset + segLen > buf.length) {
      fail(`${filePath} contains invalid segment length (${segLen}) at marker 0x${marker.toString(16)}.`);
    }
    offset += segLen;
  }

  fail(`${filePath} missing SOS (0xFF 0xDA) marker.`);
}

export function assertNoPlaceholdersInHtml(content, name, isRelease) {
  if (!isRelease) {
    return;
  }
  if (/\bdata-owner-draft\b/i.test(content)) {
    fail(`./src/${name} still contains data-owner-draft placeholder attributes.`);
  }
  if (content.includes('[PHASE 2 OWNER INPUT]')) {
    fail(`./src/${name} still contains [PHASE 2 OWNER INPUT] placeholder markers.`);
  }
  if (/Sample Draft/i.test(content)) {
    fail(`./src/${name} still contains Sample Draft placeholder text.`);
  }
  if (/example\.invalid/i.test(content)) {
    fail(`./src/${name} still contains example.invalid placeholder URLs.`);
  }
}

function assertNoPlaceholders(isRelease) {
  if (!isRelease) {
    return;
  }
  for (const name of ['index.html', '404.html']) {
    const content = fs.readFileSync(path.join(SRC_DIR, name), 'utf8');
    assertNoPlaceholdersInHtml(content, name, isRelease);
  }
}

function assertByteCap(filePath, maxBytes, label) {
  const size = fs.statSync(filePath).size;
  if (size > maxBytes) {
    fail(`${label} exceeds budget (${size} > ${maxBytes} bytes).`);
  }
  return size;
}

export function main() {
  const rawArgs = process.argv.slice(2);
  for (const arg of rawArgs) {
    if (arg !== '--release') {
      fail(`Unknown build flag "${arg}". Supported flags: --release`);
    }
  }
  const isRelease = rawArgs.includes('--release');
  const siteUrl = resolveSiteUrl(isRelease);

  assertNoPlaceholders(isRelease);
  validateSubtree(SRC_DIR, true);

  const srcScreenshotsDir = path.join(SRC_DIR, 'assets', 'screenshots');
  if (!fs.existsSync(srcScreenshotsDir)) {
    fail('Missing ./src/assets/screenshots/. Run `npm run init:fixtures` first.');
  }

  const webpFiles = fs
    .readdirSync(srcScreenshotsDir)
    .filter((name) => name.endsWith('.webp'))
    .sort();
  if (webpFiles.length === 0) {
    fail('No .webp screenshots found in ./src/assets/screenshots/. Run `npm run init:fixtures` first.');
  }

  for (const name of webpFiles) {
    assertCleanWebp(path.join(srcScreenshotsDir, name));
  }

  const ogSrcPath = path.join(SRC_DIR, 'assets', 'og-preview.jpg');
  if (!fs.existsSync(ogSrcPath)) {
    fail('Missing ./src/assets/og-preview.jpg. Run `npm run init:fixtures` first.');
  }
  assertCleanJpeg(ogSrcPath);

  const portraitSrcPath = path.join(SRC_DIR, 'assets', 'jayr-sarino.webp');
  if (!fs.existsSync(portraitSrcPath)) {
    fail('Missing ./src/assets/jayr-sarino.webp.');
  }
  assertCleanWebp(portraitSrcPath);

  const cvSrcPath = path.join(SRC_DIR, 'assets', 'jayr-sarino-cv.pdf');
  if (!fs.existsSync(cvSrcPath)) {
    fail('Missing ./src/assets/jayr-sarino-cv.pdf.');
  }
  if (fs.readFileSync(cvSrcPath).subarray(0, 5).toString('ascii') !== '%PDF-') {
    fail(`${cvSrcPath} is not a valid PDF document.`);
  }

  const srcCertificatesDir = path.join(SRC_DIR, 'assets', 'certificates');
  const certFiles = fs.existsSync(srcCertificatesDir)
    ? fs.readdirSync(srcCertificatesDir).sort()
    : [];
  for (const name of certFiles) {
    const certFilePath = path.join(srcCertificatesDir, name);
    if (name.endsWith('.webp')) {
      assertCleanWebp(certFilePath);
    } else if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
      assertCleanJpeg(certFilePath);
    } else {
      fail(`Unsupported certificate media format "${name}" (use .webp or .jpg).`);
    }
  }

  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_SCREENSHOTS_DIR, { recursive: true });
  if (certFiles.length > 0) {
    fs.mkdirSync(DIST_CERTIFICATES_DIR, { recursive: true });
  }

  if (process.env.npm_execpath) {
    execFileSync(process.execPath, [process.env.npm_execpath, 'run', 'build:css'], {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
  } else if (process.platform === 'win32') {
    execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm', 'run', 'build:css'], {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
  } else {
    execFileSync('npm', ['run', 'build:css'], {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
  }

  const copies = [
    [path.join(SRC_DIR, 'scripts', 'main.js'), path.join(DIST_ASSETS_DIR, 'main.js')],
    [path.join(SRC_DIR, '404.html'), path.join(DIST_DIR, '404.html')],
    [path.join(SRC_DIR, 'robots.txt'), path.join(DIST_DIR, 'robots.txt')],
    [path.join(SRC_DIR, '_headers'), path.join(DIST_DIR, '_headers')],
    [ogSrcPath, path.join(DIST_ASSETS_DIR, 'og-preview.jpg')],
    [portraitSrcPath, path.join(DIST_ASSETS_DIR, 'jayr-sarino.webp')],
    [cvSrcPath, path.join(DIST_ASSETS_DIR, 'jayr-sarino-cv.pdf')]
  ];
  for (const name of webpFiles) {
    copies.push([
      path.join(srcScreenshotsDir, name),
      path.join(DIST_SCREENSHOTS_DIR, name)
    ]);
  }
  for (const name of certFiles) {
    copies.push([
      path.join(srcCertificatesDir, name),
      path.join(DIST_CERTIFICATES_DIR, name)
    ]);
  }
  for (const [from, to] of copies) {
    fs.copyFileSync(from, to);
  }

  const rawIndex = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');
  const distIndex = rawIndex.replaceAll('__SITE_URL__', siteUrl);
  if (distIndex.includes('__SITE_URL__')) {
    fail('Unreplaced __SITE_URL__ token remains in ./dist/index.html.');
  }
  const distIndexPath = path.join(DIST_DIR, 'index.html');
  fs.writeFileSync(distIndexPath, distIndex, 'utf8');

  const htmlBytes = fs.statSync(distIndexPath).size;
  const cssBytes = assertByteCap(path.join(DIST_ASSETS_DIR, 'styles.css'), BUDGETS.cssMax, 'styles.css');
  const jsBytes = assertByteCap(path.join(DIST_ASSETS_DIR, 'main.js'), BUDGETS.jsMax, 'main.js');
  const ogBytes = assertByteCap(path.join(DIST_ASSETS_DIR, 'og-preview.jpg'), BUDGETS.ogPreviewMax, 'og-preview.jpg');
  const portraitBytes = assertByteCap(path.join(DIST_ASSETS_DIR, 'jayr-sarino.webp'), BUDGETS.portraitMax, 'jayr-sarino.webp');
  const cvBytes = assertByteCap(path.join(DIST_ASSETS_DIR, 'jayr-sarino-cv.pdf'), BUDGETS.cvPdfMax, 'jayr-sarino-cv.pdf');

  const landingTotal = htmlBytes + cssBytes + jsBytes;
  if (landingTotal > BUDGETS.landingTotalMax) {
    fail(`Initial landing payload exceeds budget (${landingTotal} > ${BUDGETS.landingTotalMax} bytes).`);
  }

  let galleryTotal = 0;
  for (const name of webpFiles) {
    galleryTotal += assertByteCap(
      path.join(DIST_SCREENSHOTS_DIR, name),
      BUDGETS.screenshotMax,
      name
    );
  }
  for (const name of certFiles) {
    galleryTotal += assertByteCap(
      path.join(DIST_CERTIFICATES_DIR, name),
      BUDGETS.certificateMax,
      name
    );
  }
  if (galleryTotal > BUDGETS.galleryTotalMax) {
    fail(`Gallery total exceeds budget (${galleryTotal} > ${BUDGETS.galleryTotalMax} bytes).`);
  }

  console.log(
    `Build succeeded (${isRelease ? 'release' : 'local'}): SITE_URL=${siteUrl}, landing=${landingTotal}B (HTML=${htmlBytes}B CSS=${cssBytes}B JS=${jsBytes}B), portrait=${portraitBytes}B, cv=${cvBytes}B, gallery=${galleryTotal}B, og-preview.jpg=${ogBytes}B`
  );
}

const isMainModule =
  Boolean(process.argv[1]) &&
  fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));

if (isMainModule) {
  try {
    main();
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}
