import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const autoplayAttempted = useRef(false);

  // Auto-play on first user interaction
  useEffect(() => {
    const attemptAutoplay = () => {
      if (player && playerReady && !autoplayAttempted.current) {
        autoplayAttempted.current = true;
        try {
          player.playVideo();
          setIsPlaying(true);
        } catch (error) {
          console.log('Autoplay prevented:', error);
        }
      }
    };

    if (player && playerReady && !autoplayAttempted.current) {
      // Wait for any user interaction to start music
      document.addEventListener('click', attemptAutoplay, { once: true });
      document.addEventListener('keydown', attemptAutoplay, { once: true });
      document.addEventListener('scroll', attemptAutoplay, { once: true });
      document.addEventListener('mousemove', attemptAutoplay, { once: true });
    }

    return () => {
      document.removeEventListener('click', attemptAutoplay);
      document.removeEventListener('keydown', attemptAutoplay);
      document.removeEventListener('scroll', attemptAutoplay);
      document.removeEventListener('mousemove', attemptAutoplay);
    };
  }, [player, playerReady]);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;
  }, []);

  const initializePlayer = () => {
    const newPlayer = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: 'Dkq3LD-4pmM', // Michael Bublé - Holly Jolly Christmas
      playerVars: {
        autoplay: 0, // Don't use YouTube's autoplay (we handle it manually)
        controls: 0,
        loop: 1,
        playlist: 'Dkq3LD-4pmM', // Required for loop to work
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          setPlayerReady(true);
          event.target.setVolume(volume);
        },
        onStateChange: (event) => {
          // Update playing state based on player state
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED || 
                     event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
          }
        },
      },
    });
  };

  // Update volume when changed
  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [volume, player]);

  const togglePlay = () => {
    if (!player || !playerReady) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
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
          <div className="music-subtitle">
            {!playerReady ? 'Loading...' : isPlaying ? 'Now Playing 🎄' : 'Click anywhere to start music 🎵'}
          </div>
        </div>
        <div className="music-controls">
          <button 
            onClick={togglePlay} 
            className="btn-play"
            disabled={!playerReady}
            style={{ opacity: playerReady ? 1 : 0.5 }}
          >
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
              disabled={!playerReady}
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
