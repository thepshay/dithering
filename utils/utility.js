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