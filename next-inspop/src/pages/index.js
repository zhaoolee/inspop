import fs from "fs-extra";
import path from "path";
import Papa from "papaparse";
import _ from "lodash";
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/index.module.css";
import ColorThief from "../../node_modules/colorthief/dist/color-thief.mjs";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Head from "next/head";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AudioPlayer from '../components/AudioPlayer';


let Swiper;
let SwiperSlide;
let SwiperCore;



function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const AvItem = (props) => {
  const { csvItem, env, pageHeight, currentIndex, csvItemIndex, 
    backgroundColorForContent, setBackgroundColorForContent,
    colorForContent, setColorForContent, cancalAutoRun, csvDataMaxIndex
  } = props;
  const [currentWallpapersInfoMaxIndex, setCurrentWallpapersInfoMaxIndex] =
    useState(null);




  const [currentBackGroundImageIndexRagne, setCurrentBackGroundImageIndexRagne] = useState([])

  const [csvItemIndexRagne, setCsvItemIndexRagne] = useState([])


  const [imageColor, setImageColor] = useState(null);

  const [backgroundImageUrl, setBackgroundImageUrl] =
    useState("/images/black.jpg");
  const imgRef = useRef(null);
  const colorThief = new ColorThief();

  const [currentBackGroundImageIndex, setCurrentBackGroundImageIndex] =
    useState(null);

  const nextBackGroundImage = () => {
    console.log("=nextBackGroundImage=", currentBackGroundImageIndex)
    if (currentBackGroundImageIndex !== null) {
      if (currentBackGroundImageIndex + 1 <= currentWallpapersInfoMaxIndex) {
        setCurrentBackGroundImageIndex(currentBackGroundImageIndex + 1);
      } else {
        setCurrentBackGroundImageIndex(0);
      }

      cancalAutoRun()
    }

  };

  const previousBackGroundImage = () => {
    console.log("=previousBackGroundImage=", currentBackGroundImageIndex)
    if (currentBackGroundImageIndex !== null) {
      if (currentBackGroundImageIndex - 1 >= 0) {
        setCurrentBackGroundImageIndex(currentBackGroundImageIndex - 1);
      } else {
        setCurrentBackGroundImageIndex(currentWallpapersInfoMaxIndex);
      }

      cancalAutoRun()
    }

  };

  useEffect(() => {
    console.log('==csvItem==', csvItem, csvItem["wallpapers_dir_info"])
    if (csvItem && csvItem["wallpapers_dir_info"]) {
      const tmpCurrentBackGroundImageIndex = _.random(
        0,
        csvItem["wallpapers_dir_info"].length - 1
      );

      setCurrentWallpapersInfoMaxIndex(csvItem["wallpapers_dir_info"].length - 1)

      setCurrentBackGroundImageIndex(tmpCurrentBackGroundImageIndex);
    }
  }, [csvItem]);

  const getNumbers = (arr, i, n)=> {
    let N = arr.length;
    if (n > N) {
        n = Math.floor(N / 2);
    }
    let result = [];

    for (let j = -n; j <= n; j++) {
        let index = (i + j + N) % N;
        result.push(arr[index]);
    }

    return result;
  }

  useEffect(()=>{

    const csvAllIndex = _.range(0, csvDataMaxIndex+1);

    const tmpCsvItemIndexRagne = getNumbers(csvAllIndex,  csvItemIndex, 2)


    setCsvItemIndexRagne(tmpCsvItemIndexRagne)


  }, [csvItemIndex])

  useEffect(()=>{

    if(currentWallpapersInfoMaxIndex !== null){

      const currentWallpapersInfoAllIndex = _.range(0, currentWallpapersInfoMaxIndex+1);

      const tmpCurrentBackGroundImageIndexRange = getNumbers(currentWallpapersInfoAllIndex,  currentBackGroundImageIndex, 1)
  
      setCurrentBackGroundImageIndexRagne(tmpCurrentBackGroundImageIndexRange)

      const imageUrls = [];


      for(let i = 0 ; i < tmpCurrentBackGroundImageIndexRange.length; i++) {

        const newBackgroundImage = csvItem["wallpapers_dir_info"][i];
        const tmpBackgroundImageUrl =
        `${
          env === "dev"
            ? "/wallpapers/"
            : "https://inspop.fangyuanxiaozhan.com/wallpapers/"
        }` +
        csvItem["wallpapers_dir"] +
        "/" +
        newBackgroundImage;
        imageUrls.push(tmpBackgroundImageUrl)
      }

      console.log('==imageUrls==', imageUrls)

      const loadImages = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
  
      Promise.all(loadImages)
        .then(() => {console.log('--load--', loadImages)})
        .catch(err => console.log('Some images failed to load', err));
    }

  }, [currentBackGroundImageIndex])



  useEffect(() => {

    if(csvItemIndexRagne.indexOf(currentIndex) !== -1) {
      if (currentBackGroundImageIndex !== null) {
        const newBackgroundImage =
          csvItem["wallpapers_dir_info"][currentBackGroundImageIndex];
        const tmpBackgroundImageUrl =
          `${
            env === "dev"
              ? "/wallpapers/"
              : "https://inspop.fangyuanxiaozhan.com/wallpapers/"
          }` +
          csvItem["wallpapers_dir"] +
          "/" +
          newBackgroundImage;
  
        setBackgroundImageUrl(tmpBackgroundImageUrl);
      }
    }

  }, [csvItem, currentBackGroundImageIndex, currentIndex]);

  useEffect(() => {
    if (imageColor) {
      const tmpBackGroundClolrIndex = 9;
      const tmpBackgroundColorForContent = `rgba(${imageColor[tmpBackGroundClolrIndex][0]}, ${imageColor[tmpBackGroundClolrIndex][1]}, ${imageColor[tmpBackGroundClolrIndex][2]}, 0.5)`;
      setBackgroundColorForContent(tmpBackgroundColorForContent);
      const tmpClolrIndex = 0;
      const tmpColorForContent = `rgba(${imageColor[tmpClolrIndex][0]}, ${imageColor[tmpClolrIndex][1]}, ${imageColor[tmpClolrIndex][2]}, 0.8)`;
      setColorForContent(tmpColorForContent);
    }
  }, [imageColor]);

  useEffect(() => {
    function handleLoad() {
      const color = colorThief.getPalette(imgRef.current);
      // Now you can use the color for your text or stroke
      setImageColor(color);
    }

    if (imgRef && imgRef.current) {
      if (imgRef.current.complete) {
        handleLoad();
      } else {
        imgRef.current.addEventListener("load", handleLoad);
      }
    }

    // 返回一个清理函数，在组件卸载时执行
    return () => {
      // 移除事件监听器
      if (imgRef.current) {
        imgRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, [backgroundImageUrl, setImageColor]);

  return (
    <div
      className={styles.item}
      style={{
        height: pageHeight,
        backgroundImage: `url('${backgroundImageUrl}')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      {csvItem["av_dir"] && csvItemIndex === currentIndex && (
        <AudioPlayer
          key={csvItem["av_dir_info"]["audio"]}
          currentIndex={currentIndex}
          backgroundColorForContent={backgroundColorForContent}
          cancalAutoRun={cancalAutoRun}
          currentAudio={
            `${
              env === "dev" ? "/av/" : "https://inspop.fangyuanxiaozhan.com/av/"
            }` +
            csvItem["av_dir"] +
            "/" +
            csvItem["av_dir_info"]["audio"]
          }
        />
      )}

      <div
        style={{
          position: "absolute",
          height: "100vh",
          display: "flex",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "50vw",
          }}
          onClick={previousBackGroundImage}
        ></div>

        <div
          style={{
            width: "50vw",
          }}
          onClick={nextBackGroundImage}
        ></div>
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: "20vh",
          justifyContent: "center",
          width: "100%",
          zIndex: 20,
        }}
      >
        <div
          id={colorForContent + backgroundColorForContent}
          style={{
            width: "90%",
            padding: "10px",
            backdropFilter: "blur(2px)",
            borderRadius: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "rgba(255, 255, 255, 0.8)",
            border: `2px solid ${backgroundColorForContent}`,
            textShadow: `2px 2px 4px ${colorForContent}`,
          }}
        >
          <div
            style={{
              textAlign: "left",
            }}
          >
            <p>{csvItem.en_content}</p>
            <p>{csvItem.cn_content}</p>
          </div>
          <div
            style={{
              height: "16px",
            }}
          ></div>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <p>{csvItem.en_source}</p>
            <p>{csvItem.cn_source}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsPopMenu = (props) => {
  const {
    backgroundColorForContent,
    intervalTime,
    countDown,
    setIntervalTime,
    setCountDown,
    colorForContent,
    menuChecked,
    handleMenuCheckedChange,
  } = props;

  const intervalValues = [0, 5, 10, 20, 30, 60, 300];

  const intervalTexts = [
    "No Play",
    "Every 5 seconds",
    "Every 10 seconds",
    "Every 20 seconds",
    "Every half minute",
    "Every 1 minute",
    "Every 5 minutes",
  ];



  const handleIntervalChange = (e) => {
    const newTime = parseInt(e.target.value);
    localStorage.setItem("intervalTime", newTime);
    if (newTime >= 0) {
      setIntervalTime(newTime);
      setCountDown(newTime * 1000); // 立即重置倒计时
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let newIntervalTime = 0;

      let localIntervalTime = localStorage.getItem("intervalTime");

      console.log("==localIntervalTime==", localIntervalTime);
      let numLocalIntervalTime = _.toNumber(localIntervalTime);
      if (
        _.isNumber(numLocalIntervalTime) &&
        !_.isNaN(numLocalIntervalTime) &&
        _.includes(intervalValues, numLocalIntervalTime)
      ) {
        newIntervalTime = numLocalIntervalTime;
      } else {
        newIntervalTime = 0;
      }

      localStorage.setItem("intervalTime", newIntervalTime);
      setIntervalTime(newIntervalTime);
    }
  }, []);

  return (
    <>
      <SwipeableDrawer
        open={menuChecked}
        onOpen={handleMenuCheckedChange}
        anchor={"bottom"}
        onClose={handleMenuCheckedChange}
      >
        <div
          style={{
            height: "200px",
            width: "100vw",
            bottom: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: `${backgroundColorForContent}`,
          }}
        >

          <div
            style={{
              height: "10px",
            }}
          ></div>

          <Select
            sx={{
              boxShadow: "none",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 },
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
              color: `#FFFFFF`,
              backgroundColor: `${backgroundColorForContent}`,
            }}
            type="number"
            value={intervalTime}
            onChange={handleIntervalChange}
            label="Auto Play"
          >
            {intervalValues.map((value, index) => (
              <MenuItem key={value} value={value}>
                {intervalTexts[index]}
              </MenuItem>
            ))}
          </Select>

          <div
            style={{
              height: "10px",
            }}
          ></div>

          {intervalTime > 0 && (
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: `2px 2px 4px ${colorForContent}`,
              }}
            >
              🚀 Switch after {countDown / 1000}{" "}
              {countDown > 1000 ? "seconds" : "second"}
            </p>
          )}
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default function Home({ csvData, env }) {

  let localIntervalTime = 0;
  const [intervalTime, setIntervalTime] = useState(localIntervalTime);
  const [countDown, setCountDown] = useState(intervalTime * 1000);

  const swiperRef = useRef(null);
  const csvDataMaxIndex = csvData.length - 1;

  const [pageHeight, setPageHeight] = useState(0);

  const [menuChecked, setMenuChecked] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

      const [backgroundColorForContent, setBackgroundColorForContent] =
      useState("rgba(0, 0, 0, 0.2)");
    const [colorForContent, setColorForContent] = useState(
      "rgba(255, 255, 255, 0.5)"
    );

  useEffect(() => {
    setPageHeight(window.innerHeight);

    const handleResize = () => {
      setPageHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const cancalAutoRun = () =>{
    setIntervalTime(0)
    localStorage.setItem("intervalTime", 0);
  }

  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.main,
    "&.Mui-checked": {
      color: theme.status.main,
    },
  }));

  const theme = createTheme({
    status: {
      main: `${colorForContent}`,
    },
  });

  const [currentIndex, setCurrentIndex] = useState(
    _.random(0, csvDataMaxIndex)
  );


  const handleMenuCheckedChange = () => {
    setMenuChecked(!menuChecked);
  };



  const handleSwiperInit = (swiper) => {
    console.log("swiper.activeIndex=handleSwiperInit=", swiper.activeIndex);
    swiperRef.current = swiper;


    swiper.on('transitionEnd', function() {
      setCurrentIndex(swiper.realIndex);
    });

  };

  const toSlideNext = ()=>{

    swiperRef.current.slideNext();
  }


  useEffect(() => {
    const importSwiper = async () => {
      Swiper = (await import("swiper/react")).Swiper;
      SwiperSlide = (await import("swiper/react")).SwiperSlide;
      SwiperCore = (await import("swiper/core")).default;

      const { Navigation, Pagination, Autoplay, EffectFade, Mousewheel, Keyboard } =
        await import("swiper/modules");

      // Install Swiper modules
      SwiperCore.use([Navigation, Pagination, Autoplay, Mousewheel, Keyboard]);
      setIsLoaded(true);
    };

    importSwiper();
  }, []);

  useInterval(
    () => {
      // nextCSVItem();
      toSlideNext();
      setCountDown(intervalTime * 1000);
    },
    intervalTime > 0 ? intervalTime * 1000 : null
  );

  useInterval(() => {
    setCountDown((countDown) => {
      const newCountDown = countDown - 1000;
      return newCountDown > 0 ? newCountDown : 0;
    });
  }, 1000);

  useEffect(() => {
    setCountDown(intervalTime * 1000);
  }, [intervalTime]);

  return (
    <div className={styles.main}>
      <Head>{csvData[currentIndex] && <title>{csvData[currentIndex].en_source}</title>}</Head>
      <div
        style={{
          position: "fixed",
          right: "10px",
          bottom: "10px",
          zIndex: 50,
        }}
      >
        <span>{intervalTime > 0 && "🚀"}</span>
        <ThemeProvider theme={theme}>
          <span style={{
            cursor: 'pointer'
          }} onClick={handleMenuCheckedChange}>🌈</span>
          <CustomCheckbox
            key={colorForContent}
            checked={menuChecked}
            onChange={handleMenuCheckedChange}
          />
        </ThemeProvider>
      </div>

      <InsPopMenu
        handleMenuCheckedChange={handleMenuCheckedChange}
        menuChecked={menuChecked}
        colorForContent={colorForContent}
        backgroundColorForContent={backgroundColorForContent}
        intervalTime={intervalTime}
        countDown={countDown}
        setIntervalTime={setIntervalTime}
        setCountDown={setCountDown}

      />

      {isLoaded && (
        <Swiper
          ref={swiperRef}
          onSwiper={handleSwiperInit}
          spaceBetween={0}
          slidesPerView={1}
          direction={"vertical"}
          initialSlide={currentIndex}
          realIndexChange={(e)=>{
            console.log('==realIndexChange==', e)
          }}
          style={{ height: pageHeight }}
          loop={true}
          mousewheel={{enabled: true, forceToAxis: true, thresholdTime: 1000}}
          keyboard={{ enabled: true }}
        >
          {csvData.map((csvItem, csvItemIndex) => {
            return (
              <SwiperSlide key={csvItem.cn_content}>
                <AvItem
                  key={csvItem.en_content}
                  csvItem={csvItem}
                  pageHeight={pageHeight}
                  currentIndex={currentIndex}
                  csvItemIndex={csvItemIndex}
                  env={env}
                  csvDataMaxIndex = {csvDataMaxIndex}
                  cancalAutoRun={cancalAutoRun}
                  backgroundColorForContent={backgroundColorForContent}
                  setBackgroundColorForContent={setBackgroundColorForContent}
                  colorForContent={colorForContent}
                  setColorForContent={setColorForContent}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts

  // 使用 path 模块来定位你的文件
  const inspopDataCSVPath = path.join(
    process.cwd(),
    "public",
    "inspop-data.csv"
  );

  const wallpapersInfoJsonPath = path.join(
    process.cwd(),
    "public",
    "wallpapers-info.json"
  );

  const avInfoJsonPath = path.join(process.cwd(), "public", "av-info.json");

  const wallpapersInfoJson = fs.readJsonSync(wallpapersInfoJsonPath);
  const avInfoJson = fs.readJsonSync(avInfoJsonPath);

  // 使用 fs-extra 来读取文件
  const inspopData = await fs.readFile(inspopDataCSVPath, "utf8");

  // 使用 Papa.parse 来解析 CSV 数据
  const results = Papa.parse(inspopData, { header: true });
  const sourceCsvData = results.data;

  const csvData = [];

  for (let m = 0; m < sourceCsvData.length; m++) {
    if (sourceCsvData[m] && sourceCsvData[m]["wallpapers_dir"]) {
      sourceCsvData[m]["wallpapers_dir_info"] =
        wallpapersInfoJson[sourceCsvData[m]["wallpapers_dir"]];

      if (sourceCsvData[m]["av_dir"]) {
        sourceCsvData[m]["av_dir_info"] =
          avInfoJson[sourceCsvData[m]["av_dir"]];
      }

      csvData.push(sourceCsvData[m]);
    }
  }

  // 注意，你需要返回一个对象，该对象包含 props 属性

  let env = "";

  if (process.env.NODE_ENV === "development") {
    // 开发环境下的代码
    env = "dev";
  } else {
    // 打包构建环境下的代码
    env = "prod";
  }

  return {
    props: {
      csvData: csvData,
      env: env,
    },
  };
}
