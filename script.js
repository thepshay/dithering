import { imageData64 } from "./utils/image64.js";
import { standardDither } from "./utils/standardDither.js";
import { fillCanvas } from "./utils/utility.js";
import { closestColor } from "./utils/closestColor.js";

const MATRIX_SIZE = 4;
const POWER = 4;

addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector('#image-canvas');
  const ctx = canvas.getContext('2d');

  const ditherCanvas = document.querySelector('#dither-canvas');
  const ditherCtx = ditherCanvas.getContext('2d');

  const image = new Image();
  image.src = imageData64;
  let pixelMatrix;
  let width = 0;
  let height = 0;

  image.addEventListener("load", () => {
    width = image.width;
    height = image.height;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    ditherCanvas.width = width;
    ditherCanvas.height = height;
    ditherCtx.drawImage(image, 0, 0, width, height);
    pixelMatrix = getColorMatrix(ctx, width, height);
  });

  document.querySelector("#undithered-render").addEventListener("click", () => {
    if (!pixelMatrix) {
      console.log('no image found');
      return;
    }

    const closestPixels = closestColor(pixelMatrix, POWER);
    fillCanvas(ditherCtx, closestPixels, width, height);
  })

  document.querySelector('#standard-dither').addEventListener("click", () => {
    if (!pixelMatrix) {
      console.log('no image found');
      return;
    }

    const ditheredPixels = standardDither(pixelMatrix, MATRIX_SIZE, POWER);
    fillCanvas(ditherCtx, ditheredPixels, width, height);
  })
});

const getColorMatrix = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const colorData = imageData.data;
  const colorMatrix = [];

  for (let y = 0; y < height; y++) {
    const row = [];

    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;

      const r = colorData[index];
      const g = colorData[index + 1];
      const b = colorData[index + 2];
      const a = colorData[index + 3];

      const color = { r, g, b, a };
      row.push(color);

    }
    colorMatrix.push(row);
  }

  return colorMatrix;
}