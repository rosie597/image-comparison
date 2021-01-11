const getAHashFingerprint = (imgData) => {
  const grayList = imgData.data.reduce((pre, cur, index) => {
    if ((index + 1) % 4 === 0) {
      // 取每个像素的其中一个颜色通道值
      pre.push(imgData.data[index - 1]);
    }
    return pre;
   }, []);
  const length = grayList.length;
  const grayAverage = grayList.reduce((pre, next) => (pre + next), 0) / length;
  return grayList.map(gray => (gray >= grayAverage ? 1 : 0)).join('');
}

export default getAHashFingerprint;