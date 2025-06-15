const b2 = [
  [0, 2],
  [3, 1]
];

const b4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

const b8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

const nB2 = [
  [0, 0.5],
  [0.75, 0.25]
];

const nB4 = [
  [0, 0.5, 0.13, 0.63],
  [0.75, 0.25, 0.88, 0.38],
  [0.19, 0.69, 0.06, 0.56],
  [0.94, 0.44, 0.81, 0.31]
]

const nB8 = [
  [0, 0.5, 0.13, 0.63, 0.03, 0.53, 0.16, 0.66],
  [0.75, 0.25, 0.88, 0.38, 0.78, 0.28, 0.91, 0.41],
  [0.19, 0.69, 0.06, 0.56, 0.22, 0.72, 0.09, 0.59],
  [0.94, 0.44, 0.81, 0.31, 0.97, 0.47, 0.84, 0.34],
  [0.05, 0.55, 0.17, 0.67, 0.02, 0.52, 0.14, 0.64],
  [0.8, 0.3, 0.92, 0.42, 0.77, 0.27, 0.89, 0.39],
  [0.23, 0.73, 0.11, 0.61, 0.2, 0.7, 0.08, 0.58],
  [0.98, 0.48, 0.86, 0.36, 0.95, 0.45, 0.83, 0.33]
]

const calculateNormalizedBayerMatrix = (size) => {
  const matrix = getBayerMatrix(size);
  const normalizedMatrix = new Array(size);
  const denominator = size * size;

  for (let i = 0; i < size; i++) {
    const row = new Array(size);
    for (let j = 0; j < size; j++) {
      const normalizedValue = Math.round(matrix[i][j] / denominator * 100) / 100;
      row[j] = normalizedValue;
    }
    normalizedMatrix[i] = row;
  }

  return normalizedMatrix;
}

export const getBayerMatrix = (size) => {
  if (size === 2) return b2;
  if (size === 4) return b4;
  if (size === 8) return b8;

  return;
}

export const getNormalizedBayerMatrix = (size) => {
  if (size === 2) return nB2;
  if (size === 4) return nB4;
  if (size === 8) return nB8;

  return;
}