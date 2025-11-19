import { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { themes } from '../data/themes';
import './ShareModal.css';

const ShareModal = ({ onClose }) => {
  const { calendarConfig } = useCalendar();
  const [copied, setCopied] = useState(false);

  // Generate shareable code
  const generateShareCode = () => {
    const configData = JSON.stringify(calendarConfig);
    const encoded = btoa(encodeURIComponent(configData));
    return encoded;
  };

  // Generate shareable URL
  const generateShareURL = () => {
    const shareCode = generateShareCode();
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?share=${shareCode}`;
  };

  const shareURL = generateShareURL();
  const currentTheme = themes[calendarConfig.theme];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    const code = generateShareCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div 
        className="share-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          background: currentTheme.cardBackground,
          color: currentTheme.textColor 
        }}
      >
        <h2>📤 Share Your Calendar</h2>
        <p className="share-description">
          Share this calendar with others! They can view and interact with it, but won't be able to edit the configuration.
        </p>

        <div className="share-section">
          <h3>🔗 Share Link</h3>
          <div className="share-input-group">
            <input 
              type="text" 
              value={shareURL} 
              readOnly 
              className="share-input"
            />
            <button onClick={handleCopy} className="btn-copy">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <p className="share-hint">Copy and send this link to anyone you want to share with</p>
        </div>

        <div className="share-section">
          <h3>🔑 Share Code</h3>
          <div className="share-input-group">
            <input 
              type="text" 
              value={generateShareCode().substring(0, 50) + '...'} 
              readOnly 
              className="share-input"
            />
            <button onClick={handleCopyCode} className="btn-copy">
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <p className="share-hint">Alternatively, share this code for manual import</p>
        </div>

        <div className="share-info">
          <p>ℹ️ <strong>What viewers can do:</strong></p>
          <ul>
            <li>✓ View the calendar</li>
            <li>✓ Open unlocked days</li>
            <li>✓ See gifts and fireworks</li>
            <li>✗ Cannot edit configuration</li>
            <li>✗ Cannot change theme or gifts</li>
          </ul>
        </div>

        <button onClick={onClose} className="btn-close-modal">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
