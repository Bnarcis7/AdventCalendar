import { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { themes } from '../data/themes';
import ShareModal from './ShareModal';
import MusicPlayer from './MusicPlayer';
import SnowEffect from './SnowEffect';
import CountdownTimer from './CountdownTimer';
import './Calendar.css';

const Calendar = () => {
  const { calendarConfig, setIsConfiguring, isViewerMode } = useCalendar();
  const [openedDays, setOpenedDays] = useState(new Set());
  const [answeredDays, setAnsweredDays] = useState(new Set()); // Track which days have been answered
  const [revealedGift, setRevealedGift] = useState(null);
  const [fireworks, setFireworks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const currentTheme = themes[calendarConfig.theme];

  // Check if a day is unlocked based on the date or manual unlock
  const isDayUnlocked = (day) => {
    // Check if manually unlocked
    const manuallyUnlockedDays = calendarConfig.manuallyUnlockedDays || [];
    if (manuallyUnlockedDays.includes(day)) {
      return true;
    }
    
    // Check if unlocked by date
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
      const riddleData = calendarConfig.riddles?.[day];
      if (riddleData) {
        setRevealedGift({ day, riddle: riddleData.riddle, answer: riddleData.answer });
        setUserAnswer('');
        setShowAnswer(false);
      }
    }
  };

  const handleAnswerSubmit = () => {
    setShowAnswer(true);
    if (revealedGift?.day) {
      setAnsweredDays(new Set([...answeredDays, revealedGift.day]));
    }
  };

  const handleClosePopup = () => {
    // Mark day as answered when closing popup (whether they submitted or not)
    if (revealedGift?.day && revealedGift?.riddle) {
      setAnsweredDays(new Set([...answeredDays, revealedGift.day]));
    }
    setRevealedGift(null);
    setFireworks([]);
    setUserAnswer('');
    setShowAnswer(false);
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
      <div className="calendar-content">
        {!isViewerMode && (
          <div className="admin-buttons-top">
            <button onClick={handleEdit} className="btn-edit" title="Edit Configuration">
              ⚙️
            </button>
            <button onClick={() => setShowShareModal(true)} className="btn-share">
              🎁 Send Calendar
            </button>
          </div>
        )}

        <h1 className="calendar-title">
          {currentTheme.icon} {calendarConfig.title} {currentTheme.icon}
        </h1>
        
        {isViewerMode && (
          <div className="calendar-info">
            <p className="viewer-badge">👁️ Viewing shared calendar</p>
          </div>
        )}

        <div className="calendar-grid">
          {Array.from({ length: calendarConfig.days }, (_, i) => i + 1).map(day => {
            const isOpened = openedDays.has(day);
            const isAnswered = answeredDays.has(day);
            const hasGift = calendarConfig.gifts[day];
            const hasRiddle = calendarConfig.riddles?.[day];
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
                  {isOpened && hasRiddle && isAnswered ? (
                    <div className="gift-reveal">
                      <span className="gift-emoji">💡</span>
                      <span className="gift-name">{calendarConfig.riddles[day].answer}</span>
                    </div>
                  ) : isOpened && hasRiddle ? (
                    <div className="gift-reveal">
                      <span className="gift-emoji">🎯</span>
                      <span className="gift-name">Riddle opened!</span>
                    </div>
                  ) : hasGift ? (
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
          <div className="gift-popup" onClick={handleClosePopup}>
            <div 
              className="gift-popup-content" 
              style={{ 
                background: currentTheme.cardBackground,
                color: currentTheme.textColor 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Day {revealedGift.day} 🎯</h2>
              
              {revealedGift.riddle ? (
                <div className="riddle-container">
                  <p className="riddle-question">❓ {revealedGift.riddle}</p>
                  
                  {!showAnswer && (
                    <div className="answer-input-container">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                        placeholder="Type your answer..."
                        className="answer-input"
                        autoFocus
                      />
                      <button onClick={handleAnswerSubmit} className="btn-submit-answer">
                        Submit
                      </button>
                    </div>
                  )}
                  
                  {showAnswer && (
                    <div className="answer-reveal">
                      <p className="answer-label">💡 Answer:</p>
                      <p className="answer-text">{revealedGift.answer}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="popup-gift-text">{revealedGift.gift}</p>
              )}
            </div>
          </div>
        )}

        {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}

        {/* Countdown Timer below calendar */}
        <CountdownTimer />
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Snow Effect */}
      <SnowEffect theme={calendarConfig.theme} />
    </div>
  );
};

export default Calendar;
