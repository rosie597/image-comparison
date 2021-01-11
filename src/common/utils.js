export const SCALE_VALUE = 32;

export const compressImg = (imgSrc, imgWidth, id) => {
  return new Promise((resolve, reject) => {
    if (!imgSrc) {
      reject('imgSrc can not be empty!');
    }
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = function () {
      canvas.width = imgWidth;
      canvas.height = imgWidth;
      ctx.drawImage(img, 0, 0, imgWidth, imgWidth); // 对图片进行压缩
      const data = ctx?.getImageData(0, 0, imgWidth, imgWidth); // 获取 ImgData 对象
      // ImageData { width: 8, height: 8, data: Uint8ClampedArray[256] }
      resolve(data);
    }
    img.crossOrigin = 'anonymous';
    img.src = imgSrc;
  })
}

export const createImgData = (dataDetail) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imgWidth = Math.sqrt(dataDetail.length / 4);
  const newImageData = ctx.createImageData(imgWidth, imgWidth);
  for (let i = 0; i < dataDetail.length; i += 4) {
    let R = dataDetail[i];
    let G = dataDetail[i + 1];
    let B = dataDetail[i + 2];
    let Alpha = dataDetail[i + 3];
    newImageData.data[i] = R;
    newImageData.data[i + 1] = G;
    newImageData.data[i + 2] = B;
    newImageData.data[i + 3] = Alpha;
  }
  return newImageData;
}

export const createGrayscale = (imgData) => {
  const newData = Array(imgData.data.length);
  newData.fill(0);
  imgData.data.forEach((_data, index) => {
    if ((index + 1) % 4 === 0) {
      const R = imgData.data[index - 3];
      const G = imgData.data[index - 2];
      const B = imgData.data[index - 1];
      const gray = (R + G + B) / 3;
      newData[index - 3] = gray;
      newData[index - 2] = gray;
      newData[index - 1] = gray;
      newData[index] = 255; // Alpha 值固定为255
    }
  })
  return createImgData(newData);
}

export const getNewImgDataFn = async (imgUrl, uniqueId) => {
  const data = await compressImg(imgUrl, SCALE_VALUE, uniqueId);
  const newImageData = createGrayscale(data);
  return {
    data,
    newImageData
  };
}
