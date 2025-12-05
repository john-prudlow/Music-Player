export default function Playlist({ musicList, activeSong, setActiveSong, audioRef }) {
  const handleSongSelect = (id) => {
    const track = musicList.find(t => t.id === id);
    if (track) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = track.src;
      audio.currentTime = 0;
      setActiveSong(id);
      audio.play();
    }
  };

  return (
    <ul className="song-list">
      {musicList.map(track => (
        <li
          key={track.id}
          onClick={() => handleSongSelect(track.id)}
          className={track.id === activeSong ? "highlighted" : ""}
        >
          {track.artist} - {track.title}
        </li>
      ))}
    </ul>
  );
}