import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);

  // Load YouTube IFrame API
  useEffect(() => {
    // Load the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'Dkq3LD-4pmM', // Michael Bublé - Holly Jolly Christmas
        playerVars: {
          autoplay: 1, // Auto-start on load
          controls: 0,
          loop: 1,
          playlist: 'Dkq3LD-4pmM', // Required for loop to work
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            event.target.setVolume(volume);
            setIsPlaying(true); // Update state to show it's playing
          },
          onStateChange: (event) => {
            // Update playing state based on player state
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [volume, player]);

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <div className="music-player">
      <div className="music-player-content">
        <div className="music-icon">🎵</div>
        <div className="music-info">
          <div className="music-title">Holly Jolly Christmas - Michael Bublé</div>
          <div className="music-subtitle">Christmas Music 🎄</div>
        </div>
        <div className="music-controls">
          <button onClick={togglePlay} className="btn-play">
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <span className="volume-value">{volume}%</span>
          </div>
        </div>
      </div>
      {/* Hidden YouTube player */}
      <div id="youtube-player" style={{ display: 'none' }}></div>
    </div>
  );
};

export default MusicPlayer;
