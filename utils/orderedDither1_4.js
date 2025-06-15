import { getColorPalette } from "./getColorPalette.js";
import { getNormalizedBayerMatrix } from "./thresholdMatrix.js";
import { getEuclieanDistance } from "./utility.js";

// Speeds up the calculation of mixingPlan by removing 3rd nested loop
// replaced with single calculation
// -> perceived luminosity of each color channel  

export const orderDither1_4 = (pixelMatrix, thresholdSize, power) => {
  const thresholdMatrix = getNormalizedBayerMatrix(thresholdSize);
  const ditheredPixels = [];
  const palette = getColorPalette(pixelMatrix.flat(), power);

  for (let y = 0; y < pixelMatrix.length; y++) {
    const row = [];
    for (let x = 0; x < pixelMatrix[0].length; x++) {

      const pixel = pixelMatrix[y][x];
      const factor = thresholdMatrix[x % thresholdSize][y % thresholdSize];

      const result = mixingPlan(pixel, palette, thresholdSize);
      const { palette_index1, palette_index2, ratio } = result;

      if (factor < ratio) {
        row.push(palette[palette_index2]);
      } else {
        row.push(palette[palette_index1]);
      }
    }
    ditheredPixels.push(row);
  }

  return ditheredPixels;
}

const mixingPlan = (inputColor, palette, thresholdSize) => {
  let minPenalty = 10e99;
  const paletteSize = palette.length;
  const denominator = thresholdSize * thresholdSize;
  const result = {
    palette_index1: 0,
    palette_index2: 0,
    ratio: 0,
  }

  for (let i = 0; i < paletteSize; i++) {
    for (let j = i; j < paletteSize; j++) {

      const { r: r1, g: g1, b: b1 } = palette[i];
      const { r: r2, g: g2, b: b2 } = palette[j];
      let ratio = denominator / 2;

      if (r1 !== r2 && g1 !== g2 && b1 !== b2) {

        ratio =
          ((r1 === r2 ? 299 * denominator * (r - r1) / (r2 - r1) : 0)
            + (g1 === g2 ? 587 * denominator * (g - g1) / (g2 - g1) : 0)
            + (b1 === b2 ? 114 * denominator * (b - b1) / (b2 - b1) : 0))
          / ((r2 != r1 ? 299 : 0)
            + (g2 != g1 ? 587 : 0)
            + (b2 != b1 ? 114 : 0));

        if (ratio < 0) {
          ratio = 0;
        } else if (ratio > denominator - 1) {
          ratio = denominator - 1;
        }
      }

      const r3 = r1 + ratio * (r2 - r1) / denominator;
      const g3 = g1 + ratio * (g2 - g1) / denominator;
      const b3 = b1 + ratio * (b2 - b1) / denominator;

      const penalty = evaluateMixingError(
        inputColor,
        { r: r3, g: g3, b: b3 },
        palette[i],
        palette[j],
        ratio / denominator,
      )

      if (penalty < minPenalty) {
        minPenalty = penalty;
        result.palette_index1 = i;
        result.palette_index2 = j;
        result.ratio = ratio / denominator;
      }
    }
  }

  return result;
}

const evaluateMixingError = (
  inputColor,
  mixedColor,
  color1,
  color2,
  ratio,
) => {
  return getEuclieanDistance(inputColor, mixedColor) +
    getEuclieanDistance(color1, color2) * 0.1 + (Math.abs(ratio - 0.5) + 0.5);
}