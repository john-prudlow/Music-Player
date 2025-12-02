import { useState, useRef } from 'react';
import song1 from '../source/CXR ATK - Sentinel.mp3';
import song2 from '../source/Ketsa - Make It Good.mp3';
import song3 from '../source/Happiness In Music - Cinematic Trailer.mp3';

export default function Player() {
    const [activeSong, setActiveSong] = useState(1);
    const [play, setPlay] = useState(false);
    const [rewind, setRewind] = useState(false);
    const [fastForward, setFastForward] = useState(false);

    const musicList = [{id: 1, title: "CXR ATK - Sentinel", src: song1}, {id: 2, title: "Ketsa - Make It Good", src: song2}, {id: 3, title: "Happiness In Music - Cinematic Trailer", src: song3}];
    // const songs = document.querySelectorAll('.song-list li');
    console.log("Music list: ", musicList);
    let audio = useRef(new Audio(musicList[0].src));

    const handleSongSelect = (event) => {
        const selection = event.target;
        // songs.forEach(song => {
        //     song.classList.remove("highlighted");
        // });
        // selection.classList.add("highlighted");
        if (selection) {
            const newSongId = parseInt(selection.dataset.id, 10);
            const newSong = musicList.find(song => song.id === newSongId);
            console.log("New song src: ", newSong.src);
            if (newSong) {
                audio.current.pause();
                setPlay(false);
                setActiveSong(newSong.src);
                audio.current = new Audio(newSong.src);
                audio.current.play();
            }
        }
    }
    const handleRewind = () => {
        console.log('Rewind clicked');
        setRewind(true);
        try {
            audio.current.currentTime = Math.max(audio.current.currentTime - 10, 0);
        } catch (err) {
            console.error("Error rewinding:", err);
        }
    }
    const handlePlay = () => {
        if (!play) {
            console.log('Play clicked');
            audio.current.play();
        } else {
            console.log('Pause clicked');
            audio.current.pause();
        }
        setPlay(!play);
    }
    const handleFForward = () => {
        console.log('Fast Forward clicked');
        setFastForward(true);
        try {
            audio.current.currentTime = Math.max(audio.current.currentTime + 10, 0);
        } catch (err) {
            console.error("Error fast-forwarding:", err);
        }
    }

    return (
        <>
        <ul className="song-list">
            {musicList.map((track) => (
                <li key={track.id} data-id={track.id} onClick={handleSongSelect} className={track.id === activeSong ? "highlighted" : ""}>{track.title}</li>
            ))}
        </ul>
        <div className="player">
            <button className="rewind-btn" onClick={handleRewind}><i className="fa-solid fa-backward"></i></button>
            <button className="play-btn" onClick={handlePlay}><i className="fa-solid fa-play"></i><i className="fa-solid fa-pause"></i></button>
            <button className="fforward-btn" onClick={handleFForward}><i className="fa-solid fa-forward"></i></button>
        </div>
        </>
    );
}