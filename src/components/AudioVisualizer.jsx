import { useEffect, useRef, useState } from "react";

export default function AudioVisualizer({ audioRef }) {
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [bars, setBars] = useState(new Array(32).fill(0));

  useEffect(() => {
  if (!audioRef.current) return;

  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtxRef.current.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;

    const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioCtxRef.current.destination);
  }

  const resumeContext = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };
  document.addEventListener("click", resumeContext);

  const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

  const animate = () => {
    analyserRef.current.getByteFrequencyData(dataArray);
    setBars([...dataArray]);
    requestAnimationFrame(animate);
  };
  animate();

  return () => {
    document.removeEventListener("click", resumeContext);
  };
}, [audioRef]);

  return (
    <div className="visualizer">
      {bars.map((value, i) => (
        <div
          key={i}
          className="bar"
          style={{ height: `${value / 2}px` }}
        ></div>
      ))}
    </div>
  );
}