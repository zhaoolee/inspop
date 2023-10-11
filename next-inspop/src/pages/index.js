import fs from "fs-extra";
import path from "path";
import Papa from "papaparse";
import _ from "lodash";
import { useState, useEffect, useRef } from "react";
import styles from "@/styles/index.module.css";
import ColorThief from "../../node_modules/colorthief/dist/color-thief.mjs";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Head from "next/head";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

let Swiper;
let SwiperSlide;
let SwiperCore;
let Pagination;
let Autoplay;
let EffectFade;

function AudioPlayer({ currentAudio, backgroundColorForContent }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    // 当音频播放完成时，将playing设置为false
    const handleAudioEnd = () => {
      setPlaying(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnd);
    }

    // 在组件卸载时移除事件监听器，并停止音频播放
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentAudio;
      setPlaying(false);
    }
  }, [currentAudio]);

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      <Button
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          color: "#FFFFFF",
          border: `2px solid ${backgroundColorForContent}`,
          backgroundColor: `${backgroundColorForContent}`,
          zIndex: 20,
        }}
        onClick={togglePlayPause}
      >
        {playing ? "Pause" : "Play"}
      </Button>
    </>
  );
}

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

const FullScreenImage = ({ imageUrl, setImageColor }) => {
  const imgRef = useRef(null);
  const colorThief = new ColorThief();

  useEffect(() => {
    function handleLoad() {
      const color = colorThief.getPalette(imgRef.current);
      // Now you can use the color for your text or stroke
      setImageColor(color);
    }
    if (imgRef.current.complete) {
      handleLoad();
    } else {
      imgRef.current.addEventListener("load", handleLoad);
    }

    // 返回一个清理函数，在组件卸载时执行
    return () => {
      // 移除事件监听器
      if (imgRef.current) {
        imgRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, [imageUrl, setImageColor]);
  return (
    <>
      <img
        ref={imgRef}
        src={imageUrl}
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
      <div
        className={styles.fullScreenImage}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
    </>
  );
};

const AvItem = (props) => {
  const { csvItem, env, pageHeight } = props;

  console.log('==csvItem==', csvItem);

  const [backgroundColorForContent, setBackgroundColorForContent] =
  useState("rgba(0, 0, 0, 0.2)");
  const [colorForContent, setColorForContent] = useState(
    "rgba(255, 255, 255, 0.5)"
  );

  const [imageColor, setImageColor] = useState(null);

  const [backgroundImageUrl, setBackgroundImageUrl] =
    useState("/images/black.jpg");
  const imgRef = useRef(null);
  const colorThief = new ColorThief();

  let currentBackGroundImageIndex = 0

  useEffect(() => {
    const newBackgroundImage = csvItem["wallpapers_dir_info"][currentBackGroundImageIndex];
    const tmpBackgroundImageUrl = `${env === "dev"
        ? "/wallpapers/"
        : "https://inspop.fangyuanxiaozhan.com/wallpapers/"
      }` +
      csvItem["wallpapers_dir"] +
      "/" +
      newBackgroundImage;

    console.log('==tmpBackgroundImageUrl==', tmpBackgroundImageUrl)

    setBackgroundImageUrl(tmpBackgroundImageUrl);

  }, [csvItem]);

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

    if(imgRef && imgRef.current){
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
    <div className={styles.item} style={{
      height: pageHeight
    }}>
      {/* <img
        ref={imgRef}
        src={backgroundImageUrl}
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
      <div
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`,
          fontSize: 30,
          height: pageHeight,
          position: 'fixed',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
           backgroundPosition: 'center', 
           backgroundRepeat: 'no-repeat', 
           backgroundSize: 'cover',
          zIndex: 10
        }}
      >
        <img src={backgroundImageUrl}></img>
      </div> */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 10
      }}>
        <img style={{
          width: "100%"
        }} src={backgroundImageUrl}></img>
      </div>

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
  );
};

const InsPopMenu = (props) => {
  const {
    backgroundColorForContent,
    nextCSVItem,
    intervalTime,
    countDown,
    setIntervalTime,
    currentBackGroundImageIndex,
    currentWallpapersInfoMaxIndex,
    setCurrentBackGroundImageIndex,
    setCountDown,
    currentIndex,
    setCurrentIndex,
    colorForContent,
    menuChecked,
    handleMenuCheckedChange,
    csvDataMaxIndex,
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

  const nextBackGroundImage = () => {
    if (currentBackGroundImageIndex !== null) {
      if (currentBackGroundImageIndex + 1 <= currentWallpapersInfoMaxIndex) {
        setCurrentBackGroundImageIndex(currentBackGroundImageIndex + 1);
      } else {
        setCurrentBackGroundImageIndex(0);
      }
    }
    setCountDown(intervalTime * 1000);
  };

  const previousBackGroundImage = () => {
    if (currentBackGroundImageIndex !== null) {
      if (currentBackGroundImageIndex - 1 >= 0) {
        setCurrentBackGroundImageIndex(currentBackGroundImageIndex - 1);
      } else {
        setCurrentBackGroundImageIndex(currentWallpapersInfoMaxIndex);
      }
    }
    setCountDown(intervalTime * 1000);
  };

  const previousCSVItem = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(csvDataMaxIndex);
    }
    setCountDown(intervalTime * 1000);
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
            // position: "fixed",
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
          <ButtonGroup variant="outlined">
            <Button
              style={{
                color: "#FFFFFF",
                border: `2px solid ${backgroundColorForContent}`,
                backgroundColor: `${backgroundColorForContent}`,
              }}
              startIcon={<ArrowBackIcon />}
              onClick={previousBackGroundImage}
            >
              WallPaper
            </Button>
            <Button
              style={{
                color: "#FFFFFF",
                border: `2px solid ${backgroundColorForContent}`,
                backgroundColor: `${backgroundColorForContent}`,
              }}
              endIcon={<ArrowForwardIcon />}
              onClick={nextBackGroundImage}
            >
              WallPaper
            </Button>
          </ButtonGroup>

          <div
            style={{
              height: "10px",
            }}
          ></div>

          <ButtonGroup variant="outlined">
            <Button
              style={{
                color: "#FFFFFF",
                border: `2px solid ${backgroundColorForContent}`,
                backgroundColor: `${backgroundColorForContent}`,
              }}
              startIcon={<ArrowBackIcon />}
              onClick={previousCSVItem}
            >
              Line
            </Button>
            <Button
              style={{
                color: "#FFFFFF",
                border: `2px solid ${backgroundColorForContent}`,
                backgroundColor: `${backgroundColorForContent}`,
              }}
              endIcon={<ArrowForwardIcon />}
              onClick={nextCSVItem}
            >
              Line
            </Button>
          </ButtonGroup>

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
              Switch after {countDown / 1000}{" "}
              {countDown > 1000 ? "seconds" : "second"}
            </p>
          )}
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default function Home({ csvData, wallpapersInfoJson, avInfoJson, env }) {
  // console.log("avInfoJson==", avInfoJson);
  // let localIntervalTime = 0;
  // const [intervalTime, setIntervalTime] = useState(localIntervalTime);
  // const [countDown, setCountDown] = useState(intervalTime * 1000);

  const swiperRef = useRef(null);
  const csvDataMaxIndex = csvData.length - 1;

  const [pageHeight, setPageHeight] = useState(0);

  // const [menuChecked, setMenuChecked] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setPageHeight(window.innerHeight);

    const handleResize = () => {
      setPageHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  //   color: theme.status.main,
  //   "&.Mui-checked": {
  //     color: theme.status.main,
  //   },
  // }));

  // const theme = createTheme({
  //   status: {
  //     main: `${colorForContent}`,
  //   },
  // });

  // const [currentWallpapersInfoMaxIndex, setCurrentWallpapersInfoMaxIndex] =
  //   useState(null);



  const [currentIndex, setCurrentIndex] = useState(
    _.random(0, csvDataMaxIndex)
  );

  // const [currentBackGroundImageIndex, setCurrentBackGroundImageIndex] =
  //   useState(0);

  // useInterval(
  //   () => {
  //     nextCSVItem();
  //     setCountDown(intervalTime * 1000);
  //   },
  //   intervalTime > 0 ? intervalTime * 1000 : null
  // );

  // useInterval(() => {
  //   setCountDown((countDown) => {
  //     const newCountDown = countDown - 1000;
  //     return newCountDown > 0 ? newCountDown : 0;
  //   });
  // }, 1000);

  // useEffect(() => {
  //   setCountDown(intervalTime * 1000);
  // }, [intervalTime]);


  // const handleMenuCheckedChange = () => {
  //   setMenuChecked(!menuChecked);
  // };



  // const nextCSVItem = () => {
  //   if (currentIndex + 1 <= csvDataMaxIndex) {
  //     setCurrentIndex(currentIndex + 1);
  //   } else {
  //     setCurrentIndex(0);
  //   }
  //   setCountDown(intervalTime * 1000);
  // };



  const handleSwiperInit = (swiper) => {
    console.log("swiper.activeIndex=handleSwiperInit=", swiper.activeIndex);
    swiperRef.current = swiper;
  };

  const onSlideChange = (swiper) => {
    console.log("Slide index changed to: ", swiper.activeIndex);
    setCurrentIndex(swiper.activeIndex);
  };

  useEffect(() => {
    const importSwiper = async () => {
      Swiper = (await import("swiper/react")).Swiper;
      SwiperSlide = (await import("swiper/react")).SwiperSlide;
      SwiperCore = (await import("swiper/core")).default;
      Navigation = (await import("swiper/core")).Navigation;
      Pagination = (await import("swiper/core")).Pagination;
      Autoplay = (await import("swiper/core")).Autoplay;
      EffectFade = (await import("swiper/core")).EffectFade;
      // Install Swiper modules
      SwiperCore.use([Navigation, Pagination, Autoplay]);
      console.log("==", Swiper, SwiperSlide);
      setIsLoaded(true);
    };

    importSwiper();
  }, []);



  return (
    <div className={styles.main}>
      {/* <Head>{newCSVItem && <title>{newCSVItem.en_source}</title>}</Head> */}
      {/* <FullScreenImage
        imageUrl={backgroundImageUrl}
        setImageColor={setImageColor}
      /> */}

      {/* <div
        style={{
          position: "fixed",
          right: "10px",
          bottom: "10px",
          zIndex: 50,
        }}
      >
        <ThemeProvider theme={theme}>
          <CustomCheckbox
            key={colorForContent}
            checked={menuChecked}
            onChange={handleMenuCheckedChange}
          />
        </ThemeProvider>
      </div> */}

      {/* <InsPopMenu
        menuChecked={menuChecked}
        backgroundColorForContent={backgroundColorForContent}
        nextCSVItem={nextCSVItem}
        intervalTime={intervalTime}
        countDown={countDown}
        setIntervalTime={setIntervalTime}
        currentBackGroundImageIndex={currentBackGroundImageIndex}
        currentWallpapersInfoMaxIndex={currentWallpapersInfoMaxIndex}
        setCurrentBackGroundImageIndex={setCurrentBackGroundImageIndex}
        setCountDown={setCountDown}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        colorForContent={colorForContent}
        handleMenuCheckedChange={handleMenuCheckedChange}
        csvDataMaxIndex={csvDataMaxIndex}
      /> */}

      {/* {newCSVItem && newCSVItem["av_dir"] && (
        <div>
          <AudioPlayer
            key={avInfoJson[newCSVItem["av_dir"]]["audio"]}
            backgroundColorForContent={backgroundColorForContent}
            currentAudio={
              `${env === "dev"
                ? "/av/"
                : "https://inspop.fangyuanxiaozhan.com/av/"
              }` +
              newCSVItem["av_dir"] +
              "/" +
              avInfoJson[newCSVItem["av_dir"]]["audio"]
            }
          />
        </div>
      )} */}

      {isLoaded && (
        <Swiper
          ref={swiperRef}
          onSwiper={handleSwiperInit}
          spaceBetween={0}
          direction={"vertical"}
          initialSlide={currentIndex}
          onSlideChange={onSlideChange}
          style={{  height: pageHeight }}
        >
          {csvData.map((csvItem, index) => {
            return (
              <SwiperSlide
              style={{  height: pageHeight }}
              >
                <AvItem
                  key={csvItem.en_content}
                  csvItem={csvItem}
                  pageHeight={pageHeight}
                  env={env}
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
      sourceCsvData[m]["wallpapers_dir_info"] = wallpapersInfoJson[sourceCsvData[m]["wallpapers_dir"]]

      if(sourceCsvData[m]["av_dir"]){
        sourceCsvData[m]["av_dir_info"] = avInfoJson[sourceCsvData[m]["av_dir"]]
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
      // wallpapersInfoJson: wallpapersInfoJson,
      // avInfoJson: avInfoJson,
      env: env,
    },
  };
}
