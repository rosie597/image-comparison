const hammingDistance = (fingerPrint1, fingerPrint2) => {
  let distance = 0, arr1 = fingerPrint1, arr2 = fingerPrint2;
  if (typeof fingerPrint1 === 'string') {
    arr1 = fingerPrint1.split('');
  }
  if (typeof fingerPrint2 === 'string') {
    arr2 = fingerPrint2.split('');
  }
  const total = arr1.length;
  arr1.forEach((letter, index) => {
    if (letter !== arr2[index]) {
      distance++
    }
  })
  return `${((total - distance) / total) * 100}%`;
}

export default hammingDistance;