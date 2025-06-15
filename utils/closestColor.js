import { getColorPalette } from "./getColorPalette.js";
import { getClosestColor } from "./utility.js";

// For each pixel, Input, in the original picture:
//   Color = FindClosestColorFrom(Palette, Input)
//   Draw pixel using that color.

export const closestColor = (pixelMatrix, power) => {
  const palette = getColorPalette(pixelMatrix.flat(), power);
  const closestPixels = [];

  for (let y = 0; y < pixelMatrix.length; y++) {
    const row = [];
    for (let x = 0; x < pixelMatrix[0].length; x++) {
      const currColor = pixelMatrix[y][x];
      const closestColor = getClosestColor(currColor, palette);
      row.push(closestColor);
    }
    closestPixels.push(row);
  }

  return closestPixels;
}