import './App.css';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { Upload, Button, Divider, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getNewImgDataFn, SCALE_VALUE } from './common/utils';
import getAHashFingerprint from './common/fingerPrintMethods/aHash';
import getPHashFingerPrint from './common/fingerPrintMethods/phash';
import getColorFingerPrint from './common/fingerPrintMethods/color';
import hammingDistance from './common/comparisonMethods/hamming';

// 缓存计算结果
let cachedResult = {
  hamming: {
    aHash: '',
    pHash: '',
    color: '',
  }
}

function App() {
  const [fileList, setFileList] = useState([]);
  const [Similarity, setSimilarity] = useState('0%'); // aHash 图片相似度
  const [fingerPrintSource, setFingerPrintSource] = useState(''); // 基准图片的 aHash 指纹
  const [fingerPrintTarget, setFingerPrintTarget] = useState(''); // 对比图片的 aHash 指纹
  const [sourceImgUrl, setSourceImgUrl] = useState('');
  const [targetImgUrl, setTargetImgUrl] = useState('');
  const [chosenGetHashWay, setChosenGetHashWay] = useState('aHash');
  const [chosenCompareWay, setChosenCompareWay] = useState('hamming');

  const hashMethodsMap = {
    aHash: getAHashFingerprint,
    pHash: getPHashFingerPrint,
    color: getColorFingerPrint,
  }

  const ComparisonMethodsMap = {
    hamming: hammingDistance,
  }

  const printFingerPrint = (fingerPrint) => {
    let arr = fingerPrint;
    if (typeof fingerPrint === 'string') {
      arr = fingerPrint.split('');
    }
    const res = [];
    arr.forEach((num, index) => {
      if (index && index % SCALE_VALUE === 0) {
        res.push('\t\n', num);
      } else {
        res.push(num);
      }
    })
    console.log(res.join(''));
  }

  const getHashFn = async () => {
    const { data: sourceData, newImageData: sourceNewImgData} = await getNewImgDataFn(sourceImgUrl, 'sourceImg');
    const sourceFingerPrint = chosenGetHashWay === 'color' ? 
      hashMethodsMap[chosenGetHashWay](sourceData) 
      : hashMethodsMap[chosenGetHashWay](sourceNewImgData);
    printFingerPrint(sourceFingerPrint);
    setFingerPrintSource(sourceFingerPrint);

    const { data: targetData, newImageData: targetNewImgData} = await getNewImgDataFn(targetImgUrl, 'targetImg');
    const targetFingerPrint = chosenGetHashWay === 'color' ? 
      hashMethodsMap[chosenGetHashWay](targetData) 
      : hashMethodsMap[chosenGetHashWay](targetNewImgData);
    printFingerPrint(targetFingerPrint);
    setFingerPrintTarget(targetFingerPrint);
  }

  useEffect(() => {
    const cache = cachedResult[chosenCompareWay][chosenGetHashWay]
    if (cache) {
      setSimilarity(cache);
    } else if (fileList[0] && fileList[1]) {
      getHashFn();
    }
  }, [sourceImgUrl, targetImgUrl, chosenGetHashWay]);
  
  useEffect(() => {
    if (fingerPrintSource?.length && fingerPrintTarget?.length) {
      const distance = ComparisonMethodsMap[chosenCompareWay](fingerPrintSource, fingerPrintTarget);
      cachedResult[chosenCompareWay][chosenGetHashWay] = distance;
      setSimilarity(distance);
    }
  }, [fingerPrintSource, fingerPrintTarget, chosenCompareWay]);

  const handleUploadChange = (e) => {
    setFileList(e.fileList);
    cachedResult = {
      hamming: {
        aHash: '',
        pHash: '',
        color: '',
      }
    }
    e.fileList[0] ? setSourceImgUrl(e.fileList[0].thumbUrl) : setSourceImgUrl('');
    e.fileList[1] ? setTargetImgUrl(e.fileList[1].thumbUrl): setTargetImgUrl('');
  }

  const handleUploadRemove = (e) => {
    const removedList = fileList;
    const deleteIdx = fileList.findIndex(img => img.uid === e.uid);
    removedList.splice(deleteIdx, 1);
    setFileList(removedList);
  }

  return (
    <div className="App">
      <div>
        <div style={{ width: '50%', margin: '30px auto' }}>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            defaultFileList={[...fileList]}
            onChange={handleUploadChange}
            onRemove={handleUploadRemove}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* <h1 style={{ width: '100%' }}>Compressed images: </h1> */}
          <Divider>Compressed Images: </Divider>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              Source Image: 
              {sourceImgUrl && <canvas id="sourceImg" style={{marginRight: '20px'}} width={SCALE_VALUE} height={SCALE_VALUE}></canvas>}
            </div>
            <div>
              Target Image: 
              {targetImgUrl && <canvas id="targetImg" width={SCALE_VALUE} height={SCALE_VALUE}></canvas>}
            </div>
          </div>
        </div>
      </div>
      <Divider>Comparison Methods: </Divider>
      <div>
        <div style={{ marginBottom: '10px' }}>
          <span>Methods to get Hash: </span>
          <Radio.Group value={chosenGetHashWay} onChange={(e) => setChosenGetHashWay(e.target.value)}>
            <Radio.Button value="aHash">A Hash</Radio.Button>
            <Radio.Button value="pHash">P Hash</Radio.Button>
            <Radio.Button value="color">Color</Radio.Button>
          </Radio.Group>
        </div>
        <div>
          <span>Methods to compare: </span>
          <Radio.Group value={chosenCompareWay} onChange={(e) => setChosenCompareWay(e.target.value)}>
            <Radio.Button value="hamming">Hamming</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <Divider>Comparison Result: </Divider>
      <div>
        <span style={{ padding: '20px' }}>The similarity of two pictures is: <br/> <span style={{ color: 'red' }}>{Similarity}</span></span>
      </div>
    </div>
  );
}

export default App;
