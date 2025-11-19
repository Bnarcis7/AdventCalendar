import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { themes } from '../data/themes';
import './Configurator.css';

const Configurator = () => {
  const { calendarConfig, updateConfig, setGiftForDay, setIsConfiguring, resetCalendar } = useCalendar();
  const [editingDay, setEditingDay] = useState(null);
  const [giftInput, setGiftInput] = useState('');

  const handleDaysChange = (e) => {
    const days = parseInt(e.target.value) || 1;
    updateConfig({ days: Math.min(Math.max(days, 1), 365) });
  };

  const handleThemeChange = (e) => {
    updateConfig({ theme: e.target.value });
  };

  const handleTitleChange = (e) => {
    updateConfig({ title: e.target.value });
  };

  const handleStartDateChange = (e) => {
    updateConfig({ startDate: e.target.value });
  };

  const handleAddGift = (day) => {
    if (giftInput.trim()) {
      setGiftForDay(day, giftInput.trim());
      setGiftInput('');
      setEditingDay(null);
    }
  };

  const handleRemoveGift = (day) => {
    setGiftForDay(day, null);
  };

  const handleDone = () => {
    setIsConfiguring(false);
  };

  const currentTheme = themes[calendarConfig.theme];

  return (
    <div className="configurator" style={{ 
      background: currentTheme.backgroundColor,
      color: currentTheme.textColor 
    }}>
      <div className="configurator-container">
        <h1 className="configurator-title">
          {currentTheme.icon} Calendar Configurator {currentTheme.icon}
        </h1>

        <div className="config-section">
          <label>
            <span className="label-text">Calendar Title:</span>
            <input
              type="text"
              value={calendarConfig.title}
              onChange={handleTitleChange}
              className="input-field"
              placeholder="My Advent Calendar"
            />
          </label>
        </div>

        <div className="config-section">
          <label>
            <span className="label-text">Number of Days:</span>
            <input
              type="number"
              min="1"
              max="365"
              value={calendarConfig.days}
              onChange={handleDaysChange}
              className="input-field"
            />
          </label>
        </div>

        <div className="config-section">
          <label>
            <span className="label-text">Start Date:</span>
            <input
              type="date"
              value={calendarConfig.startDate}
              onChange={handleStartDateChange}
              className="input-field"
            />
          </label>
          <p className="info-text">
            🔒 Days will be locked with chains until their date arrives!
          </p>
        </div>

        <div className="config-section">
          <label>
            <span className="label-text">Theme:</span>
            <select
              value={calendarConfig.theme}
              onChange={handleThemeChange}
              className="input-field select-field"
            >
              {Object.entries(themes).map(([key, theme]) => (
                <option key={key} value={key}>
                  {theme.icon} {theme.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="config-section gifts-section">
          <h2>Configure Gifts for Each Day</h2>
          <div className="gifts-grid">
            {Array.from({ length: calendarConfig.days }, (_, i) => i + 1).map(day => (
              <div key={day} className="gift-item">
                <div className="gift-day">Day {day}</div>
                {calendarConfig.gifts[day] ? (
                  <div className="gift-display">
                    <span className="gift-text">{calendarConfig.gifts[day]}</span>
                    <button
                      onClick={() => handleRemoveGift(day)}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  </div>
                ) : editingDay === day ? (
                  <div className="gift-input-container">
                    <input
                      type="text"
                      value={giftInput}
                      onChange={(e) => setGiftInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGift(day)}
                      placeholder="Enter gift..."
                      className="gift-input"
                      autoFocus
                    />
                    <button onClick={() => handleAddGift(day)} className="btn-add">
                      ✓
                    </button>
                    <button onClick={() => setEditingDay(null)} className="btn-cancel">
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingDay(day)}
                    className="btn-add-gift"
                  >
                    + Add Gift
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button onClick={handleDone} className="btn-done">
            Done - View Calendar
          </button>
          <button onClick={resetCalendar} className="btn-reset">
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
