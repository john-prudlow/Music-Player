import { useState, useEffect } from 'react';

export default function Player({ musicList, activeSong, setActiveSong, audioRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rewind, setRewind] = useState(false);
  const [fastForward, setFastForward] = useState(false);
  const [prevTrack, setPrevTrack] = useState(false);
  const [nextTrack, setNextTrack] = useState(false);
  const [progress, setProgress] = useState("0%");
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration > 0) {
        const percent = ((audio.currentTime / audio.duration) * 100).toFixed(2);
        setProgress(`${percent}%`);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      handleNextTrack();
    };

    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    const handleMouseUp = () => {
      setRewind(false);
      setFastForward(false);
      setPrevTrack(false);
      setNextTrack(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlayEvent);
    audio.addEventListener("pause", handlePauseEvent);
    document.addEventListener("mouseup", handleMouseUp);

    // Initialize state from element when activeSong changes
    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlayEvent);
      audio.removeEventListener("pause", handlePauseEvent);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeSong, audioRef]);

  const handlePlay = () => {
    const audio = audioRef.current;

    // If you need to resume an AudioContext, do it on user gesture here
    if (window.audioCtxRef && window.audioCtxRef.state === "suspended") {
      window.audioCtxRef.resume();
    }

    if (audio.paused) {
      audio.play().catch(err => console.log("Playback blocked:", err));
      // Do NOT setIsPlaying here; let the 'play' event update it
    } else {
      audio.pause();
      // Do NOT setIsPlaying here; let the 'pause' event update it
    }
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
    setRewind(true);
  };

  const handleFForward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || audio.currentTime + 10);
    setFastForward(true);
  };

  const handlePrevTrack = () => {
    setPrevTrack(true);
    let prevTrackId = activeSong - 1;
    if (prevTrackId < 1) prevTrackId = musicList.length;

    const audio = audioRef.current;
    audio.pause();
    audio.src = musicList[prevTrackId - 1].src;
    audio.currentTime = 0;
    setActiveSong(prevTrackId);
    setProgress("0%");
    audio.play(); // 'play' event will set isPlaying
  };

  const handleNextTrack = () => {
    setNextTrack(true);
    let nextTrackId = activeSong + 1;
    if (nextTrackId > musicList.length) nextTrackId = 1;

    const audio = audioRef.current;
    audio.pause();
    audio.src = musicList[nextTrackId - 1].src;
    audio.currentTime = 0;
    setActiveSong(nextTrackId);
    setProgress("0%");
    audio.play(); // 'play' event will set isPlaying
  };

  const handleScrubStart = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();

    const scrubTo = (clientX) => {
      const clickX = clientX - rect.left;
      const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
      const audio = audioRef.current;
      if (audio.duration > 0) {
        audio.currentTime = percent * audio.duration;
        setProgress(`${(percent * 100).toFixed(2)}%`);
      }
    };

    setScrub(true);
    scrubTo(e.clientX);

    const handleMouseMove = (moveEvent) => scrubTo(moveEvent.clientX);
    const handleMouseUp = () => {
      setScrub(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="player">
      <div className="song-display">
        <div className="track-title">
          <p>{musicList[activeSong - 1].artist} - {musicList[activeSong - 1].title}</p>
        </div>
        <div className="timeline-bar" onMouseDown={handleScrubStart}>
          <div className="progress-bar" style={{ width: progress }}>
            <div className={scrub ? "progress-handle active" : "progress-handle"}></div>
          </div>
        </div>
      </div>
      <div className="controls">
        <button className={rewind ? "rewind-btn active" : "rewind-btn"} onMouseDown={handleRewind}>
          <i className="fa-solid fa-backward"></i>
        </button>
        <button className={prevTrack ? "prev-track active" : "prev-track"} onMouseDown={handlePrevTrack}>
          <i className="fa-solid fa-backward-fast"></i>
        </button>
        <button className={isPlaying ? "play-btn active" : "play-btn"} onClick={handlePlay}>
          <i className="fa-solid fa-play"></i><i className="fa-solid fa-pause"></i>
        </button>
        <button className={nextTrack ? "next-track active" : "next-track"} onMouseDown={handleNextTrack}>
          <i className="fa-solid fa-forward-fast"></i>
        </button>
        <button className={fastForward ? "fforward-btn active" : "fforward-btn"} onMouseDown={handleFForward}>
          <i className="fa-solid fa-forward"></i>
        </button>
      </div>
    </div>
  );
}