// 划分颜色区间，默认区间数目为4个，把256种颜色取值简化为4种
function simplifyColorData (imgData, zoneAmount = 4) {
  const colorZoneDataList = [];
  const zoneStep = 256 / zoneAmount;
  const zoneBorder = [0]; // 区间边界
  for (let i = 1; i <= zoneAmount; i++) {
    zoneBorder.push(zoneStep * i - 1);
  }
  imgData.data.forEach((data, index) => {
    let d = data
    if ((index + 1) % 4 !== 0) {
      for (let i = 0; i < zoneBorder.length; i++) {
        if (data > zoneBorder[i] && data <= zoneBorder[i + 1]) {
          d = i;
        }
      }
    }
    colorZoneDataList.push(d);
  })
  return colorZoneDataList;
};

function seperateListToColorZone (simplifiedDataList) {
  const zonedList = [];
  let tempZone = '';

  simplifiedDataList.forEach((data, index) => {
    if ((index + 1) % 4 !== 0) {
      tempZone += data;
    } else {
      zonedList.push(tempZone);
      tempZone = '';
    }
  });
  return zonedList;
}

function getFingerprint (zonedList, zoneAmount = 4) {
  const colorSeperateMap = {};
  for (let i = 0; i < zoneAmount; i++) {
    for (let j = 0; j < zoneAmount; j++) {
      for (let k = 0; k < zoneAmount; k++) {
        colorSeperateMap[`${i}${j}${k}`] = 0;
      }
    }
  }
  zonedList.forEach(zone => {
    colorSeperateMap[`${zone}`]++;
  });
  return Object.values(colorSeperateMap);
}

export default function getColorFingerPrint (imgData, zoneAmount = 4) {
  const simplifiedDataList = simplifyColorData(imgData, zoneAmount);
  const zonedlist = seperateListToColorZone(simplifiedDataList);
  return getFingerprint(zonedlist, zoneAmount);
}