function memoizeCosines (length, cosMap) {
  cosMap = cosMap || {};
  cosMap[length] = new Array(length * length);
  for (let k = 0; k < length; k++) {
    for (let n = 0; n < length; n++) {
      cosMap[length][n + (k * length)] = Math.cos(Math.PI / length * (n + 0.5) * k);
    }
  }
  return cosMap;
}

function dct (signal, scale = 2) {
  let length = signal.length;
  let cosMap = null;
  if (!cosMap || !cosMap[length]) {
    cosMap = memoizeCosines(length, cosMap);
  };
  let coefficients = signal.map(function () { return 0 });
  return coefficients.map(function (_, idx) {
    return scale * signal.reduce(function (prev, cur, index) {
      return prev + (cur * cosMap[length][index + (idx * length)])
    }, 0)
  })
}

// 一维数组升维
function createMatrix (arr) {
  const length = arr.length;
  const matrixWidth = Math.sqrt(length);
  const matrix = [];
  for (let i = 0; i < matrixWidth; i++) {
    const temp = arr.slice(i * matrixWidth, i * matrixWidth + matrixWidth);
    matrix.push(temp);
  }
  return matrix;
}

// 从矩阵中获取其“左上角”大小为 range × range 的内容
function getMatrixRange (matrix, range = 1) {
  const rangeMatrix = [];
  for (let i = 0; i < range; i++) {
    for (let j = 0; j < range; j++) {
      rangeMatrix.push(matrix[i][j]);
    }
  }
  return rangeMatrix;
}

export default function getPHashFingerprint (imgData) {
  const dctData = dct(imgData.data);
  const dctMatrix = createMatrix(dctData);
  const rangeMatrix = getMatrixRange(dctMatrix, dctMatrix.length / 8);
  const rangeAvg = rangeMatrix.reduce((pre, cur) => pre + cur, 0) / rangeMatrix.length;
  return rangeMatrix.map(val => (val >= rangeAvg ? 1 : 0)).join('');
}