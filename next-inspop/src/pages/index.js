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

const FullScreenImage = ({ imageUrl, onColorExtracted }) => {
  const imgRef = useRef(null);
  const colorThief = new ColorThief();

  useEffect(() => {
    function handleLoad() {
      const color = colorThief.getPalette(imgRef.current);
      // Now you can use the color for your text or stroke
      onColorExtracted(color);
    }
    if (imgRef.current.complete) {
      handleLoad();
    } else {
      imgRef.current.addEventListener("load", handleLoad);
    }

    // 返回一个清理函数，在组件卸载时执行
    return () => {
      // 移除事件监听器
      imgRef.current.removeEventListener("load", handleLoad);
    };
  }, [imageUrl, onColorExtracted]);
  return (
    <>
      <img ref={imgRef} src={imageUrl} style={{ display: "none" }} crossOrigin="anonymous" />
      <div
        className={styles.fullScreenImage}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
    </>
  );
};

export default function Home({ csvData, wallpapersInfoJson, env }) {
  let localIntervalTime = 0;
  const [intervalTime, setIntervalTime] = useState(localIntervalTime);
  const [countDown, setCountDown] = useState(intervalTime * 1000);
  const [imageColor, setImageColor] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("/images/black.jpg");
  const [backgroundColorForContent, setBackgroundColorForContent] =
    useState("rgba(0, 0, 0, 0.2)");
  const [colorForContent, setColorForContent] = useState(
    "rgba(255, 255, 255, 0.5)"
  );

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
  const csvDataMaxIndex = csvData.length - 1;

  const [menuChecked, setMenuChecked] = useState(false);

  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: theme.status.main,
    "&.Mui-checked": {
      color: theme.status.main,
    },
  }));

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

  const theme = createTheme({
    status: {
      main: `${colorForContent}`,
    },
  });

  const [currentWallpapersInfoMaxIndex, setCurrentWallpapersInfoMaxIndex] =
    useState(null);

  const [newCSVItem, setNewCSVItem] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(
    _.random(0, csvDataMaxIndex)
  );

  const [currentBackGroundImageIndex, setCurrentBackGroundImageIndex] =
    useState(null);

  useInterval(
    () => {
      nextCSVItem();
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

  const handleIntervalChange = (e) => {
    const newTime = parseInt(e.target.value);
    localStorage.setItem("intervalTime", newTime);
    if (newTime >= 0) {
      setIntervalTime(newTime);
      setCountDown(newTime * 1000); // 立即重置倒计时
    }
  };

  useEffect(() => {
    setCountDown(intervalTime * 1000);
  }, [intervalTime]);

  useEffect(() => {
    const newCSVItem = csvData[currentIndex];
    setNewCSVItem(newCSVItem);

    const currentWallpapersInfo =
      wallpapersInfoJson[newCSVItem["wallpapers_dir"]];

    if (currentWallpapersInfo.length >= 1) {
      const currentWallpapersInfoMaxIndex = currentWallpapersInfo.length - 1;

      setCurrentWallpapersInfoMaxIndex(currentWallpapersInfoMaxIndex);
      setCurrentBackGroundImageIndex(
        _.random(0, currentWallpapersInfoMaxIndex)
      );
    }
  }, [currentIndex]);

  const handleMenuCheckedChange = () => {
    setMenuChecked(!menuChecked);
  };

  useEffect(() => {
    if (currentBackGroundImageIndex !== null) {
      const newBackgroundImage =
        wallpapersInfoJson[newCSVItem["wallpapers_dir"]][
          currentBackGroundImageIndex
        ];
      setBackgroundImageUrl(
        `${env === 'dev' ? '/wallpapers/' : 'https://inspop.fangyuanxiaozhan.com/wallpapers/'}` + newCSVItem["wallpapers_dir"] + "/" + newBackgroundImage
      );
    }
  }, [newCSVItem, currentBackGroundImageIndex]);

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

  const nextCSVItem = () => {
    if (currentIndex + 1 <= csvDataMaxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
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
    if (imageColor) {
      const tmpBackGroundClolrIndex = 9;
      const tmpBackgroundColorForContent = `rgba(${imageColor[tmpBackGroundClolrIndex][0]}, ${imageColor[tmpBackGroundClolrIndex][1]}, ${imageColor[tmpBackGroundClolrIndex][2]}, 0.5)`;
      setBackgroundColorForContent(tmpBackgroundColorForContent);
      const tmpClolrIndex = 0;
      const tmpColorForContent = `rgba(${imageColor[tmpClolrIndex][0]}, ${imageColor[tmpClolrIndex][1]}, ${imageColor[tmpClolrIndex][2]}, 0.8)`;
      setColorForContent(tmpColorForContent);
    }
  }, [imageColor]);

  return (
    <div className={styles.main}>
      <FullScreenImage
        imageUrl={backgroundImageUrl}
        onColorExtracted={setImageColor}
      />

      <div
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
      </div>

      {menuChecked && (
        <div
          style={{
            position: "fixed",
            width: "100vw",
            bottom: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
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
      )}

      {newCSVItem && (
        <div
          className={styles.item}
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
              <p>{newCSVItem.en_content}</p>
              <p>{newCSVItem.cn_content}</p>
            </div>
            <div style={{
              height: "16px"
            }}></div>
            <div
              style={{
                textAlign: "right",
              }}
            >
              <p>{newCSVItem.en_source}</p>
              <p>{newCSVItem.cn_source}</p>
            </div>
          </div>
        </div>
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

  const wallpapersInfoJson = fs.readJsonSync(wallpapersInfoJsonPath);

  // 使用 fs-extra 来读取文件
  const inspopData = await fs.readFile(inspopDataCSVPath, "utf8");

  // 使用 Papa.parse 来解析 CSV 数据
  const results = Papa.parse(inspopData, { header: true });
  const sourceCsvData = results.data;

  const csvData = [];

  for (let m = 0; m < sourceCsvData.length; m++) {
    if (sourceCsvData[m] && sourceCsvData[m]["wallpapers_dir"]) {
      csvData.push(sourceCsvData[m]);
    }
  }

  // 注意，你需要返回一个对象，该对象包含 props 属性

  let env = ''

  if (process.env.NODE_ENV === 'development') {
    // 开发环境下的代码
    env = 'dev'
  } else {
    // 打包构建环境下的代码
    env = 'prod'
  }

  return {
    props: {
      csvData: csvData,
      wallpapersInfoJson: wallpapersInfoJson,
      env: env
    },
  };
}
