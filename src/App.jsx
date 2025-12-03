import './style.css'
import Header from './components/Header'
import AudioVisualizer from './components/AudioVisualizer'
import Player from './components/Player'
import Playlist from './components/Playlist'
import { useRef, useState } from 'react'

// import songs here
import song1 from './source/CXR ATK - Sentinel.mp3'
import song2 from './source/Ketsa - Make It Good.mp3'
import song3 from './source/Happiness In Music - Cinematic Trailer.mp3'
import song4 from './source/Mr Smith - Stratus.mp3'
import song5 from './source/One Man Book - Always Never.mp3'

function App() {
  const musicList = [
    { id: 1, artist: "CXR ATK", title: "Sentinel", src: song1 },
    { id: 2, artist: "Ketsa", title: "Make It Good", src: song2 },
    { id: 3, artist: "Happiness In Music", title: "Cinematic Trailer", src: song3 },
    { id: 4, artist: "Mr Smith", title: "Stratus", src: song4 },
    { id: 5, artist: "One Man Book", title: "Always Never", src: song5 }
  ];

  const audioRef = useRef(new Audio(musicList[0].src));
  const [activeSong, setActiveSong] = useState(1);

  return (
    <>
      <Header />
      <main>
        <Playlist
          musicList={musicList}
          activeSong={activeSong}
          setActiveSong={setActiveSong}
          audioRef={audioRef}
        />
        <Player
          musicList={musicList}
          activeSong={activeSong}
          setActiveSong={setActiveSong}
          audioRef={audioRef}
        />
        <AudioVisualizer audioRef={audioRef} />
      </main>
    </>
  )
}

export default App