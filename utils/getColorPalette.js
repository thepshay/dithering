const RED = 'r';
const GREEN = 'g';
const BLUE = 'b';

export const getColorPalette = (pixelBucket, power) => {
  const cutBuckets = calculateMedianCut(pixelBucket, power);
  const partitionedColors = [];

  cutBuckets.forEach(bucket => {
    partitionedColors.push(getAverageColor(bucket));
  });

  return partitionedColors;
}

export const calculateMedianCut = (pixelBucket, power) => {
  if (power === 0) return [pixelBucket];

  const colorKey = getGreatestRangeColor(pixelBucket);
  const sortedBucket = pixelBucket.sort((a, b) => a[colorKey] - b[colorKey]);

  const mid = Math.ceil(sortedBucket.length / 2);
  const bucket1 = sortedBucket.slice(0, mid);
  const bucket2 = sortedBucket.slice(mid);

  const cutBucket1 = calculateMedianCut(bucket1, power - 1);
  const cutBucket2 = calculateMedianCut(bucket2, power - 1);

  return [...cutBucket1, ...cutBucket2];
}

const getGreatestRangeColor = (pixelBucket) => {
  const redRange = getRange(pixelBucket, "r");
  const greenRange = getRange(pixelBucket, "g");
  const blueRange = getRange(pixelBucket, "b");

  if (redRange >= greenRange && redRange >= blueRange) {
    return RED;
  } else if (greenRange >= redRange && greenRange >= blueRange) {
    return GREEN;
  } else {
    return BLUE;
  }
}

const getRange = (pixelBucket, color) => {
  let min = 255;
  let max = 0;

  pixelBucket.forEach(pixel => {
    const colorVal = pixel[color];

    if (colorVal < min) {
      min = colorVal;
    }

    if (colorVal > max) {
      max = colorVal
    }
  });

  return max - min;
}

const getAverageColor = (pixels) => {
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  const length = pixels.length;

  pixels.forEach((pixel) => {
    redSum += pixel.r;
    greenSum += pixel.g;
    blueSum += pixel.b;
  });

  const redAvg = Math.ceil(redSum / length);
  const greenAvg = Math.ceil(greenSum / length);
  const blueAvg = Math.ceil(blueSum / length);

  return { r: redAvg, g: greenAvg, b: blueAvg };
}