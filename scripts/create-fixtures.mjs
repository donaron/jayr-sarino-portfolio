/**
 * Phase 1 deterministic UI fixture media generator.
 * Pure Node.js encoders writing metadata-free:
 *   - 3x 800x1200 lossless VP8L WebP mobile UI mockup screens
 *   - 1x 1200x630 baseline SOF0 JPEG editorial portfolio card
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const ASSETS_DIR = path.join(ROOT_DIR, 'src', 'assets');
const SCREENSHOTS_DIR = path.join(ASSETS_DIR, 'screenshots');

const CODE_LENGTH_ORDER = [
  17, 18, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
];

// Compact 5x7 pixel font for crisp Material UI headers/labels inside fixture mockups.
const FONT_5X7 = {
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  '&': [0x0c, 0x12, 0x14, 0x08, 0x15, 0x12, 0x0d],
  '+': [0x00, 0x04, 0x04, 0x1f, 0x04, 0x04, 0x00],
  '-': [0x00, 0x00, 0x00, 0x1f, 0x00, 0x00, 0x00],
  '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c],
  '/': [0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10],
  ':': [0x00, 0x0c, 0x0c, 0x00, 0x0c, 0x0c, 0x00],
  '>': [0x10, 0x08, 0x04, 0x02, 0x04, 0x08, 0x10],
  '0': [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  '1': [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  '2': [0x0e, 0x11, 0x01, 0x06, 0x08, 0x10, 0x1f],
  '3': [0x1f, 0x02, 0x04, 0x06, 0x01, 0x11, 0x0e],
  '4': [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
  '5': [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  '6': [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
  '7': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  '8': [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
  '9': [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
  'A': [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'B': [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  'C': [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  'D': [0x1c, 0x12, 0x11, 0x11, 0x11, 0x12, 0x1c],
  'E': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  'F': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  'G': [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  'H': [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'I': [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  'J': [0x07, 0x02, 0x02, 0x02, 0x12, 0x12, 0x0c],
  'K': [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  'L': [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  'M': [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  'N': [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  'O': [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'P': [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  'Q': [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
  'R': [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  'S': [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  'T': [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  'U': [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'V': [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  'W': [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11],
  'X': [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  'Y': [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  'Z': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f]
};

class LsbBitWriter {
  constructor() {
    this.bytes = [];
    this.cur = 0;
    this.bitCount = 0;
  }

  writeBits(value, numBits) {
    let val = value >>> 0;
    for (let i = 0; i < numBits; i += 1) {
      if (val & 1) {
        this.cur |= 1 << this.bitCount;
      }
      val >>>= 1;
      this.bitCount += 1;
      if (this.bitCount === 8) {
        this.bytes.push(this.cur);
        this.cur = 0;
        this.bitCount = 0;
      }
    }
  }

  finish() {
    if (this.bitCount > 0) {
      this.bytes.push(this.cur);
      this.cur = 0;
      this.bitCount = 0;
    }
    return Buffer.from(this.bytes);
  }
}

function reverseBits(code, length) {
  let reversed = 0;
  for (let i = 0; i < length; i += 1) {
    reversed = (reversed << 1) | ((code >>> i) & 1);
  }
  return reversed;
}

/**
 * Builds canonical depth-limited (<= maxBits) Huffman code lengths for non-zero frequencies.
 */
function buildHuffmanLengths(freqs, maxBits = 15) {
  const n = freqs.length;
  const lengths = new Array(n).fill(0);
  const active = [];
  for (let i = 0; i < n; i += 1) {
    if (freqs[i] > 0) {
      active.push({ sym: i, freq: freqs[i] });
    }
  }

  if (active.length === 0) {
    lengths[0] = 0;
    return lengths;
  }
  if (active.length === 1) {
    return lengths;
  }
  if (active.length === 2) {
    lengths[active[0].sym] = 1;
    lengths[active[1].sym] = 1;
    return lengths;
  }

  // Soft-floor tiny frequencies to prevent deep degenerate trees exceeding maxBits.
  const minSafeFreq = Math.max(1, Math.floor(Math.max(...active.map((a) => a.freq)) / 1024));
  let queue = active.map((a) => ({ freq: Math.max(a.freq, minSafeFreq), sym: a.sym, left: null, right: null }));

  while (queue.length > 1) {
    queue.sort((a, b) => a.freq - b.freq);
    const left = queue.shift();
    const right = queue.shift();
    queue.push({ freq: left.freq + right.freq, sym: -1, left, right });
  }

  const walk = (node, depth) => {
    if (node.sym !== -1) {
      lengths[node.sym] = Math.min(maxBits, Math.max(1, depth));
      return;
    }
    walk(node.left, depth + 1);
    walk(node.right, depth + 1);
  };
  walk(queue[0], 0);

  // Enforce exact Kraft equality sum(2^(maxBits - L)) === 2^maxBits.
  const target = 1 << maxBits;
  let kraft = lengths.reduce((acc, len) => acc + (len > 0 ? (1 << (maxBits - len)) : 0), 0);
  while (kraft > target) {
    let idx = -1;
    for (let i = 0; i < n; i += 1) {
      if (lengths[i] > 0 && lengths[i] < maxBits && (idx === -1 || lengths[i] > lengths[idx])) {
        idx = i;
      }
    }
    kraft -= 1 << (maxBits - lengths[idx]);
    lengths[idx] += 1;
    kraft += 1 << (maxBits - lengths[idx]);
  }
  while (kraft < target) {
    let idx = -1;
    for (let i = 0; i < n; i += 1) {
      if (lengths[i] > 1 && kraft + (1 << (maxBits - lengths[i])) <= target) {
        if (idx === -1 || lengths[i] < lengths[idx]) {
          idx = i;
        }
      }
    }
    if (idx === -1) break;
    kraft += 1 << (maxBits - lengths[idx]);
    lengths[idx] -= 1;
  }

  if (kraft !== target) {
    throw new Error(`Invalid Kraft sum (${kraft} !== ${target}) constructing Huffman codes.`);
  }
  return lengths;
}

function assignCanonicalCodes(lengths, maxBits = 15) {
  const blCount = new Array(maxBits + 1).fill(0);
  for (const len of lengths) {
    if (len > 0) blCount[len] += 1;
  }
  const nextCode = new Array(maxBits + 1).fill(0);
  let code = 0;
  for (let bits = 1; bits <= maxBits; bits += 1) {
    code = (code + blCount[bits - 1]) << 1;
    nextCode[bits] = code;
  }
  return lengths.map((len) => {
    if (len === 0) return { code: 0, len: 0 };
    const canonical = nextCode[len];
    nextCode[len] += 1;
    return { code: reverseBits(canonical, len), len };
  });
}

function writeV7PrefixTree(bw, freqs, alphabetSize) {
  const active = [];
  for (let i = 0; i < alphabetSize; i += 1) {
    if (freqs[i] > 0) active.push(i);
  }

  if (active.length <= 1) {
    const sym = active[0] ?? 0;
    if (sym <= 255) {
      bw.writeBits(1, 1); // simple_code
      bw.writeBits(0, 1); // 1 symbol
      bw.writeBits(sym <= 1 ? 0 : 1, 1);
      bw.writeBits(sym, sym <= 1 ? 1 : 8);
      const table = new Array(alphabetSize).fill({ code: 0, len: 0 });
      table[sym] = { code: 0, len: 0 };
      return table;
    }
  }

  if (active.length === 2 && active[0] <= 255 && active[1] <= 255) {
    const [s0, s1] = active;
    bw.writeBits(1, 1); // simple_code
    bw.writeBits(1, 1); // 2 symbols
    bw.writeBits(s0 <= 1 ? 0 : 1, 1);
    bw.writeBits(s0, s0 <= 1 ? 1 : 8);
    bw.writeBits(s1, 8);
    const table = new Array(alphabetSize).fill({ code: 0, len: 0 });
    table[s0] = { code: 0, len: 1 };
    table[s1] = { code: 1, len: 1 };
    return table;
  }

  const lengths = buildHuffmanLengths(freqs.slice(0, alphabetSize), 15);
  const table = assignCanonicalCodes(lengths, 15);

  // RLE-compress runs of zeros inside lengths using symbols 17 (3..10 zeros) and 18 (11..138 zeros).
  const clSeq = [];
  for (let i = 0; i < alphabetSize;) {
    if (lengths[i] === 0) {
      let run = 0;
      while (i + run < alphabetSize && lengths[i + run] === 0 && run < 138) {
        run += 1;
      }
      if (run >= 11) {
        clSeq.push([18, run - 11, 7]);
        i += run;
      } else if (run >= 3) {
        clSeq.push([17, run - 3, 3]);
        i += run;
      } else {
        clSeq.push([0, 0, 0]);
        i += 1;
      }
    } else {
      clSeq.push([lengths[i], 0, 0]);
      i += 1;
    }
  }

  const clFreqs = new Array(19).fill(0);
  for (const [sym] of clSeq) {
    clFreqs[sym] += 1;
  }
  // Use a balanced 16-symbol fixed depth-4 code-length tree for deterministic libwebp compatibility.
  const activeCl = [];
  for (let i = 0; i < 19; i += 1) {
    if (clFreqs[i] > 0) activeCl.push(i);
  }
  if (activeCl.length > 16) {
    throw new Error(`Expected <= 16 active code-length symbols for fixed depth-4 header (got ${activeCl.length}).`);
  }
  for (let i = 0; i < 19 && activeCl.length < 16; i += 1) {
    if (clFreqs[i] === 0) activeCl.push(i);
  }
  const clLengths = new Array(19).fill(0);
  for (const sym of activeCl) {
    clLengths[sym] = 4;
  }
  const clTable = assignCanonicalCodes(clLengths, 7);

  bw.writeBits(0, 1); // normal prefix code
  bw.writeBits(15, 4); // num_code_lengths = 4 + 15 = 19
  for (let i = 0; i < 19; i += 1) {
    bw.writeBits(clLengths[CODE_LENGTH_ORDER[i]], 3);
  }
  bw.writeBits(0, 1); // use_max_symbol = 0 (reads full alphabetSize symbols)

  for (const [sym, extraVal, extraBits] of clSeq) {
    const entry = clTable[sym];
    bw.writeBits(entry.code, entry.len);
    if (extraBits > 0) {
      bw.writeBits(extraVal, extraBits);
    }
  }

  return table;
}

function encodeLengthPrefix(length) {
  if (length <= 4) {
    return { code: length - 1, extraVal: 0, extraBits: 0 };
  }
  const n = Math.floor(Math.log2(length - 1)) - 1;
  const halfBit = ((length - 1) >>> n) & 1;
  const code = 2 + 2 * n + halfBit;
  const offset = (2 + halfBit) << n;
  return { code, extraVal: (length - 1) - offset, extraBits: n };
}

/**
 * Encodes an 800x1200 RGB canvas buffer into lossless VP8L WebP using LZ77
 * row-above (distance_sym 0) & left-pixel (distance_sym 1) matches plus Huffman trees.
 */
function encodeRgbCanvasToWebp(width, height, rgbBuf) {
  const totalPixels = width * height;
  const tokens = [];

  let pos = 0;
  while (pos < totalPixels) {
    let aboveLen = 0;
    if (pos >= width) {
      const baseOff = pos * 3;
      const aboveOff = (pos - width) * 3;
      const limit = Math.min(512, totalPixels - pos);
      while (
        aboveLen < limit &&
        rgbBuf[baseOff + aboveLen * 3] === rgbBuf[aboveOff + aboveLen * 3] &&
        rgbBuf[baseOff + aboveLen * 3 + 1] === rgbBuf[aboveOff + aboveLen * 3 + 1] &&
        rgbBuf[baseOff + aboveLen * 3 + 2] === rgbBuf[aboveOff + aboveLen * 3 + 2]
      ) {
        aboveLen += 1;
      }
    }

    let leftLen = 0;
    if (pos >= 1) {
      const prevOff = (pos - 1) * 3;
      const pr = rgbBuf[prevOff];
      const pg = rgbBuf[prevOff + 1];
      const pb = rgbBuf[prevOff + 2];
      const baseOff = pos * 3;
      const limit = Math.min(512, totalPixels - pos);
      while (
        leftLen < limit &&
        rgbBuf[baseOff + leftLen * 3] === pr &&
        rgbBuf[baseOff + leftLen * 3 + 1] === pg &&
        rgbBuf[baseOff + leftLen * 3 + 2] === pb
      ) {
        leftLen += 1;
      }
    }

    if (aboveLen >= 2 && aboveLen >= leftLen) {
      tokens.push({ type: 'copy', len: aboveLen, distSym: 0 });
      pos += aboveLen;
    } else if (leftLen >= 2) {
      tokens.push({ type: 'copy', len: leftLen, distSym: 1 });
      pos += leftLen;
    } else {
      const off = pos * 3;
      tokens.push({ type: 'lit', r: rgbBuf[off], g: rgbBuf[off + 1], b: rgbBuf[off + 2] });
      pos += 1;
    }
  }

  const greenFreqs = new Array(280).fill(0);
  const redFreqs = new Array(256).fill(0);
  const blueFreqs = new Array(256).fill(0);
  const alphaFreqs = new Array(256).fill(0);
  const distFreqs = new Array(40).fill(0);

  for (const tok of tokens) {
    if (tok.type === 'lit') {
      greenFreqs[tok.g] += 1;
      redFreqs[tok.r] += 1;
      blueFreqs[tok.b] += 1;
      alphaFreqs[255] += 1;
    } else {
      const { code } = encodeLengthPrefix(tok.len);
      greenFreqs[256 + code] += 1;
      distFreqs[tok.distSym] += 1;
    }
  }

  const header = Buffer.alloc(5);
  header[0] = 0x2f;
  const packed = ((width - 1) & 0x3fff) | (((height - 1) & 0x3fff) << 14);
  header.writeUInt32LE(packed >>> 0, 1);

  const bw = new LsbBitWriter();
  bw.writeBits(0, 1); // no transforms
  bw.writeBits(0, 1); // no color cache
  bw.writeBits(0, 1); // no meta prefix codes

  const greenTable = writeV7PrefixTree(bw, greenFreqs, 280);
  const redTable = writeV7PrefixTree(bw, redFreqs, 256);
  const blueTable = writeV7PrefixTree(bw, blueFreqs, 256);
  const alphaTable = writeV7PrefixTree(bw, alphaFreqs, 256);
  const distTable = writeV7PrefixTree(bw, distFreqs, 40);

  for (const tok of tokens) {
    if (tok.type === 'lit') {
      bw.writeBits(greenTable[tok.g].code, greenTable[tok.g].len);
      bw.writeBits(redTable[tok.r].code, redTable[tok.r].len);
      bw.writeBits(blueTable[tok.b].code, blueTable[tok.b].len);
      bw.writeBits(alphaTable[255].code, alphaTable[255].len);
    } else {
      const { code, extraVal, extraBits } = encodeLengthPrefix(tok.len);
      const lenEntry = greenTable[256 + code];
      bw.writeBits(lenEntry.code, lenEntry.len);
      if (extraBits > 0) bw.writeBits(extraVal, extraBits);
      const distEntry = distTable[tok.distSym];
      bw.writeBits(distEntry.code, distEntry.len);
    }
  }

  const payload = Buffer.concat([header, bw.finish()]);
  const pad = payload.length % 2 === 1 ? Buffer.from([0x00]) : Buffer.alloc(0);

  const vp8lChunk = Buffer.alloc(8 + payload.length + pad.length);
  vp8lChunk.write('VP8L', 0, 'ascii');
  vp8lChunk.writeUInt32LE(payload.length, 4);
  payload.copy(vp8lChunk, 8);
  if (pad.length > 0) {
    pad.copy(vp8lChunk, 8 + payload.length);
  }

  const riff = Buffer.alloc(12 + vp8lChunk.length);
  riff.write('RIFF', 0, 'ascii');
  riff.writeUInt32LE(4 + vp8lChunk.length, 4);
  riff.write('WEBP', 8, 'ascii');
  vp8lChunk.copy(riff, 12);
  return riff;
}

class Canvas2D {
  constructor(width, height, bgColor) {
    this.width = width;
    this.height = height;
    this.buf = Buffer.alloc(width * height * 3);
    this.fillRect(0, 0, width, height, bgColor);
  }

  setPixel(x, y, [r, g, b]) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const idx = (y * this.width + x) * 3;
    this.buf[idx] = r;
    this.buf[idx + 1] = g;
    this.buf[idx + 2] = b;
  }

  fillRect(x, y, w, h, rgb) {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.floor(x + w));
    const y1 = Math.min(this.height, Math.floor(y + h));
    for (let py = y0; py < y1; py += 1) {
      for (let px = x0; px < x1; px += 1) {
        const idx = (py * this.width + px) * 3;
        this.buf[idx] = rgb[0];
        this.buf[idx + 1] = rgb[1];
        this.buf[idx + 2] = rgb[2];
      }
    }
  }

  fillRoundedRect(x, y, w, h, r, rgb) {
    const rad = Math.min(r, Math.floor(w / 2), Math.floor(h / 2));
    this.fillRect(x + rad, y, w - 2 * rad, h, rgb);
    this.fillRect(x, y + rad, w, h - 2 * rad, rgb);
    const r2 = rad * rad;
    const corners = [
      [x + rad, y + rad],
      [x + w - rad - 1, y + rad],
      [x + rad, y + h - rad - 1],
      [x + w - rad - 1, y + h - rad - 1]
    ];
    for (const [cx, cy] of corners) {
      for (let dy = -rad; dy <= rad; dy += 1) {
        for (let dx = -rad; dx <= rad; dx += 1) {
          if (dx * dx + dy * dy <= r2) {
            this.setPixel(cx + dx, cy + dy, rgb);
          }
        }
      }
    }
  }

  strokeRoundedCard(x, y, w, h, r, borderRgb, fillRgb, borderThickness = 2) {
    this.fillRoundedRect(x, y, w, h, r, borderRgb);
    this.fillRoundedRect(
      x + borderThickness,
      y + borderThickness,
      w - 2 * borderThickness,
      h - 2 * borderThickness,
      Math.max(1, r - borderThickness),
      fillRgb
    );
  }

  fillCircle(cx, cy, radius, rgb) {
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx * dx + dy * dy <= r2) {
          this.setPixel(cx + dx, cy + dy, rgb);
        }
      }
    }
  }

  drawText(x, y, text, scale, rgb) {
    let cursorX = x;
    const upper = text.toUpperCase();
    for (const ch of upper) {
      const glyph = FONT_5X7[ch] || FONT_5X7[' '];
      for (let row = 0; row < 7; row += 1) {
        const bits = glyph[row];
        for (let col = 0; col < 5; col += 1) {
          if ((bits >>> (4 - col)) & 1) {
            this.fillRect(cursorX + col * scale, y + row * scale, scale, scale, rgb);
          }
        }
      }
      cursorX += 6 * scale;
    }
  }
}

const C = {
  bg: [248, 250, 252],
  white: [255, 255, 255],
  border: [203, 213, 225],
  slate900: [15, 23, 42],
  slate800: [30, 41, 59],
  slate700: [51, 65, 85],
  slate500: [100, 116, 139],
  slate200: [226, 232, 240],
  cobalt700: [29, 78, 216],
  cobalt100: [219, 234, 254],
  teal700: [15, 118, 110],
  teal100: [204, 251, 241],
  green700: [21, 128, 61],
  green100: [220, 252, 231],
  amber800: [146, 64, 14],
  amber100: [254, 243, 199],
  red700: [185, 28, 28],
  red100: [254, 226, 226]
};

function drawMobileChrome(
  canvas,
  appBarRgb,
  titleText,
  activeTabIdx,
  tabLabels = ['HOME', 'CLINIC', 'SOS'],
  accentRgb = C.cobalt700,
  accentBgRgb = C.cobalt100
) {
  // Status bar
  canvas.fillRect(0, 0, 800, 44, C.slate900);
  canvas.drawText(32, 14, '09:41', 2, C.white);
  canvas.fillRect(700, 14, 18, 16, C.white);
  canvas.fillRect(726, 16, 40, 14, C.slate200);
  canvas.fillRect(728, 18, 28, 10, C.white);

  // Material 3 App Bar
  canvas.fillRect(0, 44, 800, 112, appBarRgb);
  canvas.drawText(40, 86, titleText, 4, C.white);
  canvas.fillRoundedRect(692, 74, 72, 48, 24, C.white);
  canvas.fillCircle(728, 98, 10, appBarRgb);

  // Bottom Material Navigation Bar
  canvas.fillRect(0, 1096, 800, 104, C.white);
  canvas.fillRect(0, 1094, 800, 2, C.border);
  for (let i = 0; i < 3; i += 1) {
    const cx = 133 + i * 267;
    if (i === activeTabIdx) {
      canvas.fillRoundedRect(cx - 56, 1112, 112, 38, 19, accentBgRgb);
    }
    canvas.fillRoundedRect(cx - 18, 1123, 36, 16, 4, i === activeTabIdx ? accentRgb : C.slate500);
    canvas.drawText(
      cx - tabLabels[i].length * 6,
      1160,
      tabLabels[i],
      2,
      i === activeTabIdx ? accentRgb : C.slate500
    );
  }
}

function renderScreen1Dashboard() {
  const c = new Canvas2D(800, 1200, C.bg);
  drawMobileChrome(c, C.cobalt700, 'RESIDENT PORTAL', 0, ['HOME', 'CLINIC', 'SOS'], C.cobalt700, C.cobalt100);

  // Emergency SOS & Healthcare Quick Cards
  c.strokeRoundedCard(32, 184, 356, 178, 18, C.red700, C.white);
  c.fillRoundedRect(56, 208, 176, 30, 15, C.red100);
  c.drawText(72, 216, 'SOS DISPATCH', 2, C.red700);
  c.drawText(56, 260, 'ONE-TAP GPS ALERT', 2, C.slate900);
  c.drawText(56, 294, 'PHOTO + LIVE PIN', 2, C.slate500);
  c.fillRect(56, 326, 220, 12, C.red100);

  c.strokeRoundedCard(412, 184, 356, 178, 18, C.border, C.white);
  c.fillRoundedRect(436, 208, 196, 30, 15, C.teal100);
  c.drawText(452, 216, 'CLINIC BOOKING', 2, C.teal700);
  c.drawText(436, 260, 'BRGY II HEALTH', 2, C.slate900);
  c.drawText(436, 294, 'CHECKUP & MEDICINE', 2, C.slate500);
  c.fillRect(436, 326, 220, 12, C.teal100);

  // Stacked Resident Request & Advisory Feed
  const cardSpecs = [
    {
      y: 388,
      title: 'SOS: ROAD HAZARD',
      subtitle: 'TANOD UNIT DISPATCHED - GPS',
      dotBg: C.red100,
      dotFg: C.red700,
      badgeBg: C.amber100,
      badgeFg: C.amber800,
      label: 'EN ROUTE'
    },
    {
      y: 584,
      title: 'PRENATAL CHECKUP',
      subtitle: 'BRGY II CLINIC AT 10:00',
      dotBg: C.teal100,
      dotFg: C.teal700,
      badgeBg: C.green100,
      badgeFg: C.green700,
      label: 'APPROVED'
    },
    {
      y: 780,
      title: 'BARANGAY II FORUM',
      subtitle: 'DRAINAGE CLEANUP ADVISORY',
      dotBg: C.cobalt100,
      dotFg: C.cobalt700,
      badgeBg: C.cobalt100,
      badgeFg: C.cobalt700,
      label: 'VERIFIED'
    }
  ];
  for (const item of cardSpecs) {
    c.strokeRoundedCard(32, item.y, 736, 174, 18, C.border, C.white);
    c.fillCircle(88, item.y + 84, 28, item.dotBg);
    c.fillCircle(88, item.y + 84, 12, item.dotFg);
    c.drawText(140, item.y + 38, item.title, 3, C.slate900);
    c.drawText(140, item.y + 84, item.subtitle, 2, C.slate500);
    c.fillRect(140, item.y + 118, 300, 12, C.slate200);
    c.fillRoundedRect(584, item.y + 36, 156, 34, 17, item.badgeBg);
    c.drawText(604, item.y + 46, item.label, 2, item.badgeFg);
  }

  // Material FAB (Quick SOS Action)
  c.fillRoundedRect(664, 984, 96, 96, 26, C.red700);
  c.drawText(696, 1012, '+', 6, C.white);

  return encodeRgbCanvasToWebp(800, 1200, c.buf);
}

function renderScreen2RealtimeSync() {
  const c = new Canvas2D(800, 1200, C.bg);
  drawMobileChrome(c, C.slate800, 'TANOD DISPATCH', 0, ['MAP', 'UNITS', 'ALERTS'], C.slate800, C.slate200);

  // Live Firestore & GPS stream banner
  c.strokeRoundedCard(32, 180, 736, 92, 18, C.slate800, C.slate200);
  c.fillCircle(74, 226, 14, C.green700);
  c.drawText(106, 218, 'LIVE FIRESTORE + GPS STREAM', 2, C.slate900);
  c.fillRoundedRect(614, 208, 126, 34, 17, C.green100);
  c.drawText(638, 218, 'ONLINE', 2, C.green700);

  // Interactive Command Center Map Canvas
  c.strokeRoundedCard(32, 294, 736, 266, 18, C.border, C.white);
  c.fillRoundedRect(48, 310, 704, 234, 12, C.bg);
  // Stylized streets + block geometry
  c.fillRect(48, 388, 704, 18, C.slate200);
  c.fillRect(48, 474, 704, 14, C.slate200);
  c.fillRect(240, 310, 18, 234, C.slate200);
  c.fillRect(496, 310, 18, 234, C.slate200);
  c.fillRoundedRect(536, 326, 198, 36, 18, C.green100);
  c.drawText(552, 337, 'RULE VALIDATED', 2, C.green700);

  // SOS Incident Pin + Active Patroller Route
  c.fillCircle(249, 396, 34, C.red100);
  c.fillCircle(249, 396, 14, C.red700);
  c.drawText(186, 440, 'SOS PIN 204', 2, C.red700);

  for (let x = 288; x <= 468; x += 28) {
    c.fillRect(x, 477, 16, 8, C.cobalt700);
  }
  c.fillCircle(505, 480, 32, C.cobalt100);
  c.fillCircle(505, 480, 14, C.cobalt700);
  c.drawText(436, 518, 'TANOD T-02', 2, C.cobalt700);

  // Dispatch Lifecycle & Rule Check Cards
  const items = [
    {
      y: 582,
      stripe: C.red700,
      title: 'CASE 204 - NIGHT PATROL',
      meta: 'FLOW: PENDING -> EN ROUTE',
      pillBg: C.amber100,
      pillFg: C.amber800,
      pillText: 'EN ROUTE'
    },
    {
      y: 760,
      stripe: C.teal700,
      title: 'UNIT T-02 LIVE ETA: 3 MIN',
      meta: 'BACKGROUND GPS BROADCAST ON',
      pillBg: C.cobalt100,
      pillFg: C.cobalt700,
      pillText: 'TRACKING'
    },
    {
      y: 938,
      stripe: C.green700,
      title: 'FAKE-REPORT FILTER CHECK',
      meta: 'GPS + PHOTO + RESIDENT UID OK',
      pillBg: C.green100,
      pillFg: C.green700,
      pillText: 'VERIFIED'
    }
  ];
  for (const item of items) {
    c.strokeRoundedCard(32, item.y, 736, 152, 16, item.stripe, C.white);
    c.fillRect(34, item.y + 18, 8, 116, item.stripe);
    c.drawText(66, item.y + 34, item.title, 3, C.slate900);
    c.drawText(66, item.y + 82, item.meta, 2, C.slate500);
    c.fillRect(66, item.y + 114, 320, 12, C.slate200);
    c.fillRoundedRect(580, item.y + 30, 160, 34, 17, item.pillBg);
    c.drawText(600, item.y + 40, item.pillText, 2, item.pillFg);
  }

  return encodeRgbCanvasToWebp(800, 1200, c.buf);
}

function renderScreen3ValidationRules() {
  const c = new Canvas2D(800, 1200, C.bg);
  drawMobileChrome(c, C.teal700, 'HEALTHCARE ADMIN', 0, ['QUEUE', 'STOCK', 'LOGS'], C.teal700, C.teal100);

  // Clinic Queue Summary Card
  c.strokeRoundedCard(32, 184, 736, 182, 18, C.border, C.white);
  c.drawText(60, 214, 'CLINIC APPOINTMENT QUEUE', 3, C.slate900);
  c.drawText(60, 260, 'BRGY II POBLACION - BHW & MIDWIFE', 2, C.slate500);
  c.fillRoundedRect(60, 304, 168, 34, 17, C.green100);
  c.drawText(76, 314, '4 APPROVED', 2, C.green700);
  c.fillRoundedRect(246, 304, 168, 34, 17, C.amber100);
  c.drawText(266, 314, '2 PENDING', 2, C.amber800);
  c.fillRoundedRect(432, 304, 198, 34, 17, C.teal100);
  c.drawText(450, 314, 'STOCK MONITOR', 2, C.teal700);

  // Appointment & Medicine Inventory Rows
  const rows = [
    {
      y: 390,
      header: '09:30 SLOT - PRENATAL CHECKUP',
      detail: 'APPROVED - FCM PUSH SENT',
      badgeBg: C.green100,
      badgeFg: C.green700,
      badge: 'APPROVED',
      dotBg: C.green100,
      dotFg: C.green700
    },
    {
      y: 572,
      header: 'INVENTORY: AMOXICILLIN & ORS',
      detail: '42 PACKS IN STOCK - EXP 10/2027',
      badgeBg: C.teal100,
      badgeFg: C.teal700,
      badge: 'IN STOCK',
      dotBg: C.teal100,
      dotFg: C.teal700
    },
    {
      y: 754,
      header: 'PARACETAMOL RESUPPLY ALERT',
      detail: 'PATIENT LOG CHECK - REORDER',
      badgeBg: C.amber100,
      badgeFg: C.amber800,
      badge: 'RESTOCK',
      dotBg: C.amber100,
      dotFg: C.amber800
    }
  ];
  for (const row of rows) {
    c.strokeRoundedCard(32, row.y, 736, 158, 16, C.border, C.white);
    c.drawText(60, row.y + 24, row.header, 2, C.slate900);
    c.fillRoundedRect(60, row.y + 66, 520, 48, 10, C.bg);
    c.drawText(76, row.y + 82, row.detail, 2, C.slate700);
    c.fillRoundedRect(598, row.y + 20, 144, 32, 16, row.badgeBg);
    c.drawText(614, row.y + 29, row.badge, 2, row.badgeFg);
    c.fillCircle(696, row.y + 94, 22, row.dotBg);
    c.fillCircle(696, row.y + 94, 10, row.dotFg);
  }

  // Primary Publish Advisory Button
  c.fillRoundedRect(32, 954, 736, 84, 18, C.teal700);
  c.drawText(192, 986, 'PUBLISH HEALTH ADVISORY', 3, C.white);

  return encodeRgbCanvasToWebp(800, 1200, c.buf);
}

class JpegBitWriter {
  constructor() {
    this.bytes = [];
    this.cur = 0;
    this.bitCount = 0;
  }

  writeBits(code, length) {
    for (let i = length - 1; i >= 0; i -= 1) {
      this.cur = (this.cur << 1) | ((code >>> i) & 1);
      this.bitCount += 1;
      if (this.bitCount === 8) {
        this.emitByte(this.cur);
        this.cur = 0;
        this.bitCount = 0;
      }
    }
  }

  emitByte(byte) {
    this.bytes.push(byte & 0xff);
    if ((byte & 0xff) === 0xff) {
      this.bytes.push(0x00);
    }
  }

  finish() {
    if (this.bitCount > 0) {
      const padBits = 8 - this.bitCount;
      const finalByte = (this.cur << padBits) | ((1 << padBits) - 1);
      this.emitByte(finalByte);
      this.cur = 0;
      this.bitCount = 0;
    }
    return Buffer.from(this.bytes);
  }
}

function dcCategory(diff) {
  let absVal = Math.abs(diff);
  let bits = 0;
  while (absVal > 0) {
    bits += 1;
    absVal >>= 1;
  }
  return bits;
}

function encodeSignedMagnitude(diff, category) {
  return diff >= 0 ? diff : (1 << category) - 1 + diff;
}

function rgbToYCbCrLevel([r, g, b]) {
  const y = Math.max(0, Math.min(255, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
  const cb = Math.max(0, Math.min(255, Math.round(128 - 0.168736 * r - 0.331264 * g + 0.5 * b)));
  const cr = Math.max(0, Math.min(255, Math.round(128 + 0.5 * r - 0.418688 * g - 0.081312 * b)));
  return [y - 128, cb - 128, cr - 128];
}

/**
 * Encodes a 1200x630 editorial banner baseline JPEG using 8x8 solid macro-blocks
 * without EXIF/XMP/APP1 segments.
 */
function renderOgBannerJpeg(width = 1200, height = 630) {
  const mcuCols = Math.ceil(width / 8); // 150
  const mcuRows = Math.ceil(height / 8); // 79
  const duskBg = [15, 7, 32];
  const duskCard = [27, 16, 53];
  const fuchsia400 = [232, 121, 249];
  const teal400 = [45, 212, 191];
  const teal950 = [4, 47, 46];
  const violet50 = [245, 243, 255];
  const violet200 = [221, 214, 254];
  const grid = Array.from({ length: mcuRows }, () => new Array(mcuCols).fill(duskBg));

  const fillBlockRect = (bx, by, bw, bh, color) => {
    for (let y = Math.max(0, by); y < Math.min(mcuRows, by + bh); y += 1) {
      for (let x = Math.max(0, bx); x < Math.min(mcuCols, bx + bw); x += 1) {
        grid[y][x] = color;
      }
    }
  };

  // Top fuchsia accent band + elevated dusk card + architecture trio
  fillBlockRect(0, 0, mcuCols, 3, fuchsia400);
  fillBlockRect(8, 9, 134, 61, duskCard);
  fillBlockRect(12, 13, 36, 4, teal400);       // eyebrow bar
  fillBlockRect(12, 20, 76, 6, violet50);      // hero title block
  fillBlockRect(12, 29, 98, 3, violet200);     // subtitle line

  // 3 architecture visual blocks: Stitch/Rules -> 5 Flutter Apps -> Cloud Firestore & FCM
  fillBlockRect(12, 42, 34, 18, violet50);
  fillBlockRect(15, 45, 22, 3, duskBg);
  fillBlockRect(52, 49, 6, 2, fuchsia400);
  fillBlockRect(62, 42, 36, 18, fuchsia400);
  fillBlockRect(66, 45, 24, 3, duskBg);
  fillBlockRect(104, 49, 6, 2, teal400);
  fillBlockRect(114, 42, 24, 18, teal400);
  fillBlockRect(117, 45, 16, 3, teal950);

  const makeSegment = (marker, body) => {
    const seg = Buffer.alloc(4 + body.length);
    seg[0] = 0xff;
    seg[1] = marker;
    seg.writeUInt16BE(body.length + 2, 2);
    body.copy(seg, 4);
    return seg;
  };

  const app0 = makeSegment(0xe0, Buffer.from([
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x01, 0x00,
    0x00, 0x01, 0x00, 0x01,
    0x00, 0x00
  ]));

  const buildDqtBody = (tableId) => {
    const buf = Buffer.alloc(65);
    buf[0] = tableId & 0x0f;
    buf.fill(8, 1);
    return buf;
  };

  const sof0 = Buffer.alloc(15);
  sof0[0] = 8;
  sof0.writeUInt16BE(height, 1);
  sof0.writeUInt16BE(width, 3);
  sof0[5] = 3;
  sof0.set([1, 0x11, 0], 6);
  sof0.set([2, 0x11, 1], 9);
  sof0.set([3, 0x11, 1], 12);

  // DC categories 0..9 avoiding all-1s codewords per ITU-T T.81.
  const dcHuffCodes = [
    [0b0, 1],
    [0b1000, 4], [0b1001, 4], [0b1010, 4], [0b1011, 4],
    [0b11000, 5], [0b11001, 5], [0b11010, 5], [0b11011, 5],
    [0b111000, 6]
  ];
  const buildDcDht = (tableId) => makeSegment(0xc4, Buffer.from([
    tableId & 0x0f,
    1, 0, 0, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9
  ]));
  const buildAcDht = (tableId) => makeSegment(0xc4, Buffer.from([
    0x10 | (tableId & 0x0f),
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0x00
  ]));

  const sos = makeSegment(0xda, Buffer.from([
    3,
    1, 0x00,
    2, 0x11,
    3, 0x11,
    0x00, 0x3f, 0x00
  ]));

  const jbw = new JpegBitWriter();
  const prevDc = [0, 0, 0];

  for (let by = 0; by < mcuRows; by += 1) {
    for (let bx = 0; bx < mcuCols; bx += 1) {
      const target = rgbToYCbCrLevel(grid[by][bx]);
      for (let c = 0; c < 3; c += 1) {
        const diff = target[c] - prevDc[c];
        prevDc[c] = target[c];
        const cat = dcCategory(diff);
        const [code, len] = dcHuffCodes[cat];
        jbw.writeBits(code, len);
        if (cat > 0) {
          jbw.writeBits(encodeSignedMagnitude(diff, cat), cat);
        }
        jbw.writeBits(0b00, 2); // AC EOB
      }
    }
  }

  return Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    app0,
    makeSegment(0xdb, buildDqtBody(0)),
    makeSegment(0xdb, buildDqtBody(1)),
    makeSegment(0xc0, sof0),
    buildDcDht(0),
    buildAcDht(0),
    buildDcDht(1),
    buildAcDht(1),
    sos,
    jbw.finish(),
    Buffer.from([0xff, 0xd9])
  ]);
}

function main() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const fixtures = [
    {
      path: path.join(SCREENSHOTS_DIR, 'capstone-screen-1.webp'),
      data: renderScreen1Dashboard()
    },
    {
      path: path.join(SCREENSHOTS_DIR, 'capstone-screen-2.webp'),
      data: renderScreen2RealtimeSync()
    },
    {
      path: path.join(SCREENSHOTS_DIR, 'capstone-screen-3.webp'),
      data: renderScreen3ValidationRules()
    },
    {
      path: path.join(ASSETS_DIR, 'og-preview.jpg'),
      data: renderOgBannerJpeg(1200, 630)
    }
  ];

  for (const item of fixtures) {
    fs.writeFileSync(item.path, item.data);
    console.log(`Wrote fixture: ${path.relative(ROOT_DIR, item.path)} (${item.data.length} bytes)`);
  }
}

main();
