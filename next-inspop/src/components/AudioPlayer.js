import { useState, useRef , useEffect} from "react";
import Button from "@mui/material/Button";


function AudioPlayer({
  currentAudio,
  backgroundColorForContent,
  cancalAutoRun,
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    cancalAutoRun();
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
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "#FFFFFF",
          border: `2px solid ${backgroundColorForContent}`,
          backgroundColor: `${backgroundColorForContent}`,
          zIndex: 20,
        }}
        onClick={togglePlayPause}
      >
        {playing ? "🤫 Pause" : "🔊 Play"}
      </Button>
    </>
  );
}

export default AudioPlayer;
