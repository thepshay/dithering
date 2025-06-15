import { getNormalizedBayerMatrix } from "./thresholdMatrix.js";
import { getColorPalette } from "./getColorPalette.js";
import { getEuclieanDistance } from "./utility.js";

// uniform precision
export const standardDither = (pixelMatrix, thresholdSize, power) => {
  const threshold = [64, 64, 64]; // Threshold = COLOR(256/4, 256/4, 256/4); 
  const thresholdMatrix = getNormalizedBayerMatrix(thresholdSize);
  const ditheredPixels = [];
  const palette = getColorPalette(pixelMatrix.flat(), power);

  for (let y = 0; y < pixelMatrix.length; y++) {
    const row = [];
    for (let x = 0; x < pixelMatrix[0].length; x++) {

      const pixel = pixelMatrix[y][x];
      const factor = thresholdMatrix[x % thresholdSize][y % thresholdSize];
      const { r: r0, g: g0, b: b0 } = pixel;

      const r1 = r0 + factor * threshold[0];
      const g1 = g0 + factor * threshold[1];
      const b1 = b0 + factor * threshold[2];

      const attemptColor = { r: r1, g: g1, b: b1 };
      const closestColor = getClosestColor(attemptColor, palette);
      row.push(closestColor);
    }
    ditheredPixels.push(row);
  }

  return ditheredPixels;
}

const getClosestColor = (targetColor, palette) => {

  let minDist = 1000;
  let closestColor = { r: 0, g: 0, b: 0 };

  for (let i = 0; i < palette.length; i++) {
    const currColor = palette[i];
    const currDist = getEuclieanDistance(targetColor, currColor);

    if (currDist < minDist) {
      minDist = currDist;
      closestColor = currColor;
    }
  }

  return closestColor;
}