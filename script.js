import { imageData64 } from "./utils/image64.js";
import { standardDither } from "./utils/standardDither.js";

const MATRIX_SIZE = 4;
const POWER = 2;

addEventListener("DOMContentLoaded", (event) => {
  console.log('hello')

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

  document.querySelector('#standard-dither').addEventListener("click", () => {
    if (!pixelMatrix) {
      console.log('no image found');
      return;
    }

    const ditheredPixels = standardDither(pixelMatrix, MATRIX_SIZE, POWER);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = ditheredPixels[y][x];

        
        ditherCtx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ditherCtx.fillRect(x, y, 1, 1);
      }
    }
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