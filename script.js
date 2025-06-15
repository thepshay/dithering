import { imageData64 } from "./utils/image64.js";
import { standardDither } from "./utils/standardDither.js";
import { fillCanvas, initializeCanvas } from "./utils/utility.js";
import { closestColor } from "./utils/closestColor.js";

addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector('#image-canvas');
  const ctx = canvas.getContext('2d');

  const ditherCanvas = document.querySelector('#dither-canvas');
  const ditherCtx = ditherCanvas.getContext('2d');

  const image = new Image();
  image.src = imageData64;
  let pixelMatrix;

  let power;
  let matrixSize;

  const powerButtons = document.querySelectorAll("input[name='power']");
  for (const powerButton of powerButtons) {
    if (powerButton.checked) {
      power = powerButton.value;
      break;
    }
  }

  const matrixSizeButtons = document.querySelectorAll("input[name='matrix-size']");
  for (const matrixSizeButton of matrixSizeButtons) {
    if (matrixSizeButton.checked) {
      matrixSize = matrixSizeButton.value;
      break;
    }
  }

  image.addEventListener("load", () => {
    const width = image.width;
    const height = image.height;

    initializeCanvas(canvas, ctx, image, width, height);
    initializeCanvas(ditherCanvas, ditherCtx, image, width, height);

    pixelMatrix = getColorMatrix(ctx, width, height);

    document.querySelector('.power-container').addEventListener('change', (event) => {
      if (event.target.type === 'radio' && event.target.name === 'power') {
        power = event.target.value;
      }

      console.log(power)
    })

    document.querySelector('.matrix-size-container').addEventListener('change', (event) => {
      if (event.target.type === 'radio' && event.target.name === 'matrix-size') {
        matrixSize = event.target.value;
      }

      console.log(matrixSize);
    })


    document.querySelector("#undithered-render").addEventListener("click", () => {
      const closestPixels = closestColor(pixelMatrix, power);
      fillCanvas(ditherCtx, closestPixels, width, height);

      console.log("undithered-render: finish");
    })

    document.querySelector('#standard-dither').addEventListener("click", () => {
      const ditheredPixels = standardDither(pixelMatrix, Number(matrixSize), power);
      fillCanvas(ditherCtx, ditheredPixels, width, height);

      console.log("standard-dither: finish");
    })
  });
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