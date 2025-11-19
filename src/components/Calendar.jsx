import { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { themes } from '../data/themes';
import ShareModal from './ShareModal';
import MusicPlayer from './MusicPlayer';
import './Calendar.css';

const Calendar = () => {
  const { calendarConfig, setIsConfiguring, isViewerMode } = useCalendar();
  const [openedDays, setOpenedDays] = useState(new Set());
  const [revealedGift, setRevealedGift] = useState(null);
  const [fireworks, setFireworks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const currentTheme = themes[calendarConfig.theme];

  // Check if a day is unlocked based on the date
  const isDayUnlocked = (day) => {
    const startDate = new Date(calendarConfig.startDate);
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + (day - 1));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate <= today;
  };

  // Create continuous fireworks effect
  useEffect(() => {
    let interval;
    if (revealedGift) {
      // Create initial fireworks immediately
      createFireworks();
      
      // Then create new fireworks every 800ms while gift is revealed
      interval = setInterval(() => {
        createFireworks();
      }, 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [revealedGift]);

  const createFireworks = () => {
    const newFireworks = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + Math.random() * 1000 + i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 0.3,
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff69b4', '#ffd700'][Math.floor(Math.random() * 8)]
    }));
    setFireworks(prev => [...prev, ...newFireworks]);
    
    // Remove these fireworks after their animation completes
    setTimeout(() => {
      setFireworks(prev => prev.filter(fw => !newFireworks.find(nfw => nfw.id === fw.id)));
    }, 1500);
  };

  const handleDayClick = (day) => {
    if (!isDayUnlocked(day)) {
      // Day is locked, shake the door
      return;
    }
    
    if (!openedDays.has(day)) {
      setOpenedDays(new Set([...openedDays, day]));
      if (calendarConfig.gifts[day]) {
        setRevealedGift({ day, gift: calendarConfig.gifts[day] });
        setTimeout(() => {
          setRevealedGift(null);
          setFireworks([]); // Clear all fireworks when popup closes
        }, 3000);
      }
    }
  };

  const handleEdit = () => {
    setIsConfiguring(true);
  };

  return (
    <div 
      className="calendar-container" 
      style={{ 
        background: currentTheme.backgroundColor,
        color: currentTheme.textColor 
      }}
    >
      {/* Decorative elements */}
      <div className="decorations">
        {Array.from({ length: 20 }).map((_, i) => (
          <span 
            key={i} 
            className="decoration" 
            style={{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            {currentTheme.decoration}
          </span>
        ))}
      </div>

      <div className="calendar-content">
        <h1 className="calendar-title">
          {currentTheme.icon} {calendarConfig.title} {currentTheme.icon}
        </h1>
        
        <div className="calendar-info">
          <p>🔓 Click unlocked days to reveal your gifts! 🎁</p>
          <p>🔒 Locked days will unlock on their date</p>
          {isViewerMode && (
            <p className="viewer-badge">👁️ Viewing shared calendar</p>
          )}
        </div>
        
        {!isViewerMode && (
          <div className="admin-buttons">
            <button onClick={handleEdit} className="btn-edit">
              ⚙️ Edit Configuration
            </button>
            <button onClick={() => setShowShareModal(true)} className="btn-share">
              📤 Share Calendar
            </button>
          </div>
        )}

        <div className="calendar-grid">
          {Array.from({ length: calendarConfig.days }, (_, i) => i + 1).map(day => {
            const isOpened = openedDays.has(day);
            const hasGift = calendarConfig.gifts[day];
            const isUnlocked = isDayUnlocked(day);

            return (
              <div
                key={day}
                className={`calendar-door ${isOpened ? 'opened' : ''} ${hasGift ? 'has-gift' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => handleDayClick(day)}
                style={{
                  background: isOpened ? currentTheme.accentColor : currentTheme.cardBackground
                }}
              >
                <div className="door-front">
                  <div className="door-number">{day}</div>
                  <div className="door-icon">{currentTheme.doorIcon}</div>
                  {!isUnlocked && !isOpened && (
                    <div className="lock-overlay">
                      <div className="decoration-item bell-1">🔔</div>
                      <div className="decoration-item bell-2">🔔</div>
                      <div className="decoration-item tree-1">🎄</div>
                      <div className="decoration-item ball-1">🎀</div>
                      <div className="decoration-item ball-2">🎀</div>
                      <div className="decoration-item star-1">⭐</div>
                      <div className="decoration-item star-2">⭐</div>
                      <div className="lock-icon">🔒</div>
                    </div>
                  )}
                </div>
                <div className="door-back">
                  {hasGift ? (
                    <div className="gift-reveal">
                      <span className="gift-emoji">🎁</span>
                      <span className="gift-name">{calendarConfig.gifts[day]}</span>
                    </div>
                  ) : (
                    <div className="no-gift">
                      <span>{currentTheme.decoration}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fireworks */}
        {fireworks.length > 0 && (
          <div className="fireworks-container">
            {fireworks.map((fw) => (
              <div
                key={fw.id}
                className="firework"
                style={{
                  left: `${fw.left}%`,
                  top: `${fw.top}%`,
                  animationDelay: `${fw.delay}s`,
                  '--firework-color': fw.color
                }}
              >
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
                <div className="firework-spark"></div>
              </div>
            ))}
          </div>
        )}

        {revealedGift && (
          <div className="gift-popup">
            <div className="gift-popup-content" style={{ 
              background: currentTheme.cardBackground,
              color: currentTheme.textColor 
            }}>
              <h2>Day {revealedGift.day} {currentTheme.icon}</h2>
              <p className="popup-gift-text">{revealedGift.gift}</p>
            </div>
          </div>
        )}

        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
      </div>

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default Calendar;
