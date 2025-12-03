import { useState, useRef, useEffect } from 'react';
import song1 from '../source/CXR ATK - Sentinel.mp3';
import song2 from '../source/Ketsa - Make It Good.mp3';
import song3 from '../source/Happiness In Music - Cinematic Trailer.mp3';
import song4 from '../source/Mr Smith - Stratus.mp3';
import song5 from '../source/One Man Book - Always Never.mp3';

export default function Player() {
  const [activeSong, setActiveSong] = useState(1);
  const [play, setPlay] = useState(false);
  const [rewind, setRewind] = useState(false);
  const [fastForward, setFastForward] = useState(false);
  const [prevTrack, setPrevTrack] = useState(false);
  const [nextTrack, setNextTrack] = useState(false);
  const [progress, setProgress] = useState("0%");
  const [scrub, setScrub] = useState(false);

  const musicList = [
    { id: 1, artist: "CXR ATK", title: "Sentinel", src: song1 },
    { id: 2, artist: "Ketsa", title: "Make It Good", src: song2 },
    { id: 3, artist: "Happiness In Music", title: "Cinematic Trailer", src: song3 },
    { id: 4, artist: "Mr Smith", title: "Stratus", src: song4 },
    { id: 5, artist: "One Man Book", title: "Always Never", src: song5 }
  ];

  const audioRef = useRef(new Audio(musicList[0].src));

  // Attach progress listener
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration > 0) {
        const percent = ((audio.currentTime / audio.duration) * 100).toFixed(2);
        setProgress(`${percent}%`);
        console.log("Progress update: ", progress);
      }
    };

    const handleEnded = () => {
        handleNextTrack(); // move to next track automatically
    };

    const handleMouseUp = () => {
        setRewind(false);
        setFastForward(false);
        setPrevTrack(false);
        setNextTrack(false);
    }

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    document.addEventListener("mouseup", handleMouseUp);

    // cleanup when component unmounts
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleSongSelect = (event) => {
    const newSongId = parseInt(event.target.dataset.id, 10);
    const newSong = musicList.find(song => song.id === newSongId);
    if (newSong) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = newSong.src;
      audio.currentTime = 0;
      setActiveSong(newSong.id);
      setProgress("0%");
      console.log("Progress: ", progress);
      audio.play();
      setPlay(true);
    }
  };

  const handlePlay = () => {
    if (!play) {
      audioRef.current.play();
      setPlay(true);
    } else {
      audioRef.current.pause();
      setPlay(false);
    }
  };

  const handleRewind = () => {
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    setRewind(true);
  };

  const handleFForward = () => {
    audioRef.current.currentTime += 10;
    setFastForward(true);
  };

  const handlePrevTrack = () => {
    setPrevTrack(true);
    let prevTrackId = activeSong - 1;
    if (prevTrackId < 1) {
        prevTrackId = musicList.length;
    }
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setActiveSong(prevTrackId);
    setProgress("0%");
    audio.src = musicList[prevTrackId - 1].src;
    audio.play();
    setPlay(true);
  };

  const handleNextTrack = () => {
    setNextTrack(true);
    let nextTrackId = activeSong + 1;
    if (nextTrackId > musicList.length) {
        nextTrackId = 1;
    }
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setActiveSong(nextTrackId);
    setProgress("0%");
    audio.src = musicList[nextTrackId - 1].src;
    audio.play();
    setPlay(true);
  };

  const handleScrubStart = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();

    const scrub = (clientX) => {
        const clickX = clientX - rect.left;
        const percent = Math.min(Math.max(clickX / rect.width, 0), 1); // clamp 0–1
        const audio = audioRef.current;
        if (audio.duration > 0) {
        audio.currentTime = percent * audio.duration;
        setProgress(`${(percent * 100).toFixed(2)}%`);
        }
    };

    setScrub(true);

    // initial position
    scrub(e.clientX);

    // move handler
    const handleMouseMove = (moveEvent) => {
        scrub(moveEvent.clientX);
    };

    // stop handler
    const handleMouseUp = () => {
        setScrub(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  return (
    <>
      <ul className="song-list">
        {musicList.map((track) => (
          <li
            key={track.id}
            data-id={track.id}
            onClick={handleSongSelect}
            className={track.id === activeSong ? "highlighted" : ""}
          >
            {track.artist} - {track.title}
          </li>
        ))}
      </ul>
      <div className="player">
        <div className="song-display">
          <div className="track-title">
            <p>{musicList[activeSong - 1].artist} - {musicList[activeSong - 1].title}</p>
          </div>
          <div className="timeline-bar" onMouseDown={handleScrubStart}><div className="progress-bar" style={{ width: progress }}><div className={scrub ? "progress-handle active" : "progress-handle"}></div></div></div>
        </div>
        <div className="controls">
          <button className={rewind ? "rewind-btn active" : "rewind-btn"} onMouseDown={handleRewind}><i className="fa-solid fa-backward"></i></button>
          <button className={prevTrack ? "prev-track active" : "prev-track"} onMouseDown={handlePrevTrack}><i className="fa-solid fa-backward-fast"></i></button>
          <button className={play ? "play-btn active" : "play-btn"} onClick={handlePlay}><i className="fa-solid fa-play"></i><i className="fa-solid fa-pause"></i></button>
          <button className={nextTrack ? "next-track active" : "next-track"} onMouseDown={handleNextTrack}><i className="fa-solid fa-forward-fast"></i></button>
          <button className={fastForward ? "fforward-btn active" : "fforward-btn"} onMouseDown={handleFForward}><i className="fa-solid fa-forward"></i></button>
        </div>
      </div>
    </>
  );
}
