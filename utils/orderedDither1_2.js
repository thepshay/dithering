import { getColorPalette } from "./getColorPalette.js";
import { getNormalizedBayerMatrix } from "./thresholdMatrix.js";
import { getEuclieanDistance } from "./utility.js";

export const orderDither1_2 = (pixelMatrix, thresholdSize, power) => {
  const thresholdMatrix = getNormalizedBayerMatrix(thresholdSize);
  const ditheredPixels = [];
  const palette = getColorPalette(pixelMatrix.flat(), power);

  for (let y = 0; y < pixelMatrix.length; y++) {
    const row = [];
    for (let x = 0; x < pixelMatrix[0].length; x++) {

      const pixel = pixelMatrix[y][x];
      const factor = thresholdMatrix[x % thresholdSize][y % thresholdSize];

      const result = mixingPlan(pixel, palette, thresholdSize);
      const { palette_index1, palette_index2, ratio} = result;

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
      for (let k = 0; k < denominator; k++) {
        if (i === j && k !== 0) break;
        const { r: r1, g: g1, b: b1 } = palette[i];
        const { r: r2, g: g2, b: b2 } = palette[j];

        const r3 = r1 + k * (r2 - r1) / denominator;
        const g3 = g1 + k * (g2 - g1) / denominator;
        const b3 = b1 + k * (b2 - b1) / denominator;

        const penalty = evaluateMixingError(
          inputColor,
          { r: r3, g: g3, b: b3 },
          { r: r1, g: g1, b: b1 },
          { r: r2, g: g2, b: b2 },
          k / denominator,
        )

        if (penalty < minPenalty) {
          minPenalty = penalty;
          result.palette_index1 = i;
          result.palette_index2 = j;
          result.ratio = k / denominator;
        }
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
    getEuclieanDistance(color1, color2) * 0.1;
}