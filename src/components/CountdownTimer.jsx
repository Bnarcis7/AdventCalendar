import { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const { calendarConfig } = useCalendar();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextLockedDay, setNextLockedDay] = useState(null);

  useEffect(() => {
    const calculateNextLockedDay = () => {
      const startDate = new Date(calendarConfig.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find the next locked day
      for (let day = 1; day <= calendarConfig.days; day++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + (day - 1));
        dayDate.setHours(0, 0, 0, 0);

        if (dayDate > today) {
          setNextLockedDay({ day, date: dayDate });
          return dayDate;
        }
      }
      
      return null; // All days are unlocked
    };

    const updateCountdown = () => {
      const nextDate = calculateNextLockedDay();
      
      if (!nextDate) {
        setNextLockedDay(null);
        return;
      }

      const now = new Date();
      const midnight = new Date(nextDate);
      midnight.setHours(0, 0, 0, 0);
      
      const diff = midnight - now;

      if (diff <= 0) {
        // Time has passed, recalculate next day
        calculateNextLockedDay();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Initial calculation
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [calendarConfig.startDate, calendarConfig.days]);

  // Don't show countdown if all days are unlocked or no locked days
  if (!nextLockedDay) {
    return null;
  }

  return (
    <div className="countdown-timer">
      <div className="countdown-sleigh">
        <div className="sleigh-decoration">
          <span className="santa">🎅</span>
          <span className="reindeer">🦌</span>
          <span className="reindeer">🦌</span>
        </div>
        
        <div className="countdown-content">
          <div className="countdown-title">
            � Ho Ho Ho! Next Present Opens In... 🎄
          </div>
          <div className="countdown-display">
            <div className="time-unit">
              <div className="time-value">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="time-label">Hours</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="time-label">Minutes</div>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <div className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="time-label">Seconds</div>
            </div>
          </div>
          <div className="countdown-day-info">
            🎁 Day {nextLockedDay.day} - {nextLockedDay.date.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric'
            })} 🎁
          </div>
        </div>

        <div className="sleigh-gifts">
          <span className="gift-box">🎁</span>
          <span className="gift-box">🎁</span>
          <span className="gift-box">🎁</span>
        </div>
      </div>
      
      <div className="sleigh-trail">✨✨✨</div>
    </div>
  );
};

export default CountdownTimer;
