import { getColorPalette } from "./getColorPalette.js";
import { getNormalizedBayerMatrix } from "./thresholdMatrix.js";
import { getEuclieanDistance } from "./utility.js";

// For each pixel, Input, in the original picture:
//   Factor  = ThresholdMatrix[xcoordinate % X][ycoordinate % Y];
//   Make a Plan, based on Input and the Palette.

//   If Factor < Plan.ratio,
//     Draw pixel using Plan.color2
//   else,
//     Draw pixel using Plan.color1

//   SmallestPenalty = 10^99 /* Impossibly large number */
// For each unique combination of two colors from the palette, Color1 and Color2:
//   For each possible Ratio, 0 .. (X*Y-1):
//     /* Determine what mixing the two colors in this proportion will produce */
//     Mixed = Color1 + Ratio * (Color2 - Color1) / (X*Y)
//     /* Rate how well it matches what we want to accomplish */
//     Penalty = Evaluate the difference of Input and Mixed.
//     /* Keep the result that has the smallest error */
//     If Penalty < SmallestPenalty,
//       SmallestPenalty = Penalty
//       Plan = { Color1, Color2, Ratio / (X*Y) }.

export const orderDither1_1 = (pixelMatrix, thresholdSize, power) => {
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
        row.push(palette[palette_index1]);
      } else {
        row.push(palette[palette_index2]);
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
  ratio
) => {
  return getEuclieanDistance(inputColor, mixedColor);
}