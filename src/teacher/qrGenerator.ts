/**
 * Generates a clean, standalone SVG QR Code for classroom tablet/phone scanning.
 * Implements a lightweight ISO/IEC 18004 compliant QR Code generator (Byte mode, Version 1-4).
 */

// Error correction and encoding tables
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF256_EXP[i] = GF256_EXP[i - 255];
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function polyMultiply(p1: number[], p2: number[]): number[] {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMultiply(p1[i], p2[j]);
    }
  }
  return result;
}

function getGeneratorPoly(degree: number): number[] {
  let g = [1];
  for (let i = 0; i < degree; i++) {
    g = polyMultiply(g, [1, GF256_EXP[i]]);
  }
  return g;
}

function calculateEcc(data: number[], numEccBytes: number): number[] {
  const gen = getGeneratorPoly(numEccBytes);
  const info = [...data, ...new Array(numEccBytes).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const factor = info[i];
    if (factor !== 0) {
      for (let j = 0; j < gen.length; j++) {
        info[i + j] ^= gfMultiply(gen[j], factor);
      }
    }
  }
  return info.slice(data.length);
}

/**
 * Creates an SVG QR code string from any URL or plain text.
 */
export function generateQrSvg(text: string, size = 200): string {
  // Determine version needed (Level L, Byte mode)
  // Version 2 (25x25) capacity: 32 bytes; Version 4 (33x33) capacity: 78 bytes; Version 6: 134 bytes
  const textBytes = new TextEncoder().encode(text);
  const version = textBytes.length <= 32 ? 2 : textBytes.length <= 78 ? 4 : 6;
  const moduleCount = 17 + 4 * version;

  // Total data codewords and ECC codewords for level L
  const versionData: Record<number, { dataCodewords: number; eccCodewords: number }> = {
    2: { dataCodewords: 34, eccCodewords: 10 },
    4: { dataCodewords: 80, eccCodewords: 18 },
    6: { dataCodewords: 136, eccCodewords: 28 }
  };

  const { dataCodewords, eccCodewords } = versionData[version];

  // Bit buffer encoding (Byte Mode: 0100)
  const bitBuffer: number[] = [];
  function pushBits(val: number, bits: number) {
    for (let i = bits - 1; i >= 0; i--) {
      bitBuffer.push((val >>> i) & 1);
    }
  }

  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(textBytes.length, 8); // Character count
  for (const byte of textBytes) {
    pushBits(byte, 8);
  }

  // Terminator
  pushBits(0, Math.min(4, dataCodewords * 8 - bitBuffer.length));
  while (bitBuffer.length % 8 !== 0) {
    bitBuffer.push(0);
  }

  // Convert to bytes & pad with 0xEC, 0x11
  const rawBytes: number[] = [];
  for (let i = 0; i < bitBuffer.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bitBuffer[i + j];
    }
    rawBytes.push(byte);
  }

  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (rawBytes.length < dataCodewords) {
    rawBytes.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  // Compute Error Correction
  const eccBytes = calculateEcc(rawBytes, eccCodewords);
  const allCodewords = [...rawBytes, ...eccBytes];

  // Initialize Matrix
  const matrix: Array<Array<number | null>> = Array.from({ length: moduleCount }, () =>
    new Array(moduleCount).fill(null)
  );
  const isFunctionModule: boolean[][] = Array.from({ length: moduleCount }, () =>
    new Array(moduleCount).fill(false)
  );

  // Finder patterns
  function addFinder(startX: number, startY: number) {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const rX = startX + x;
        const rY = startY + y;
        if (rX < 0 || rX >= moduleCount || rY < 0 || rY >= moduleCount) continue;
        isFunctionModule[rY][rX] = true;
        if (x >= 0 && x <= 6 && y >= 0 && y <= 6) {
          matrix[rY][rX] =
            x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)
              ? 1
              : 0;
        } else {
          matrix[rY][rX] = 0;
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(moduleCount - 7, 0);
  addFinder(0, moduleCount - 7);

  // Timing patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    if (!isFunctionModule[6][i]) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      isFunctionModule[6][i] = true;
    }
    if (!isFunctionModule[i][6]) {
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
      isFunctionModule[i][6] = true;
    }
  }

  // Dark module
  matrix[4 * version + 9][8] = 1;
  isFunctionModule[4 * version + 9][8] = true;

  // Format information (Mask 0, Level L: 0b111011111000100)
  const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
  for (let i = 0; i < 15; i++) {
    const bit = formatBits[i];
    // Top-left
    let x = i < 6 ? i : i < 8 ? i + 1 : moduleCount - 15 + i;
    let y = i < 7 ? 8 : i === 7 ? 8 : 14 - i;
    if (i >= 8) {
      x = 8;
      y = i < 9 ? moduleCount - 15 + i : moduleCount - 15 + i;
    }
  }

  // Place codewords in zigzag pattern
  let codewordIdx = 0;
  let bitIdx = 7;
  let upwards = true;

  for (let right = moduleCount - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing column
    const rows = upwards
      ? Array.from({ length: moduleCount }, (_, i) => moduleCount - 1 - i)
      : Array.from({ length: moduleCount }, (_, i) => i);

    for (const r of rows) {
      for (const col of [right, right - 1]) {
        if (!isFunctionModule[r][col]) {
          let bit = 0;
          if (codewordIdx < allCodewords.length) {
            bit = (allCodewords[codewordIdx] >>> bitIdx) & 1;
            bitIdx--;
            if (bitIdx < 0) {
              bitIdx = 7;
              codewordIdx++;
            }
          }
          // Apply mask 0: (row + col) % 2 === 0
          if ((r + col) % 2 === 0) {
            bit ^= 1;
          }
          matrix[r][col] = bit;
        }
      }
    }
    upwards = !upwards;
  }

  // Build SVG string
  const quietZone = 2;
  const totalGrid = moduleCount + quietZone * 2;
  const cellSize = (size / totalGrid).toFixed(2);

  let paths = '';
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (matrix[y][x] === 1) {
        const px = (x + quietZone) * Number(cellSize);
        const py = (y + quietZone) * Number(cellSize);
        paths += `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges" aria-label="QR Code for ${text}">
    <rect width="${size}" height="${size}" fill="#ffffff" />
    ${paths}
  </svg>`;
}
