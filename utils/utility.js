export const getEuclieanDistance = (startingColor, nextColor) => {
  const { r: red1, g: green1, b: blue1 } = startingColor;
  const { r: red2, g: green2, b: blue2 } = nextColor;

  const dRed = red1 - red2;
  const dGreen = green1 - green2;
  const dBlue = blue1 - blue2;

  const squaredDistance = dRed * dRed + dGreen * dGreen + dBlue * dBlue;
  const distance = Math.sqrt(squaredDistance);

  return distance;
}

export const getClosestColor = (targetColor, palette) => {
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

export const fillCanvas = (ctx, newPixels, width, height) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = newPixels[y][x];

      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

export const initializeCanvas = (canvas, ctx, image, width, height) => {
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
}