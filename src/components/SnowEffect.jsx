import React, { useEffect, useState } from 'react';
import './SnowEffect.css';

const SnowEffect = ({ theme }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  // Only show snow on winter/Christmas themes
  const showSnow = theme === 'christmas' || theme === 'newyear';

  useEffect(() => {
    if (!showSnow) {
      setSnowflakes([]);
      return;
    }

    // Generate 80 snowflakes with random properties
    const flakes = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      animationDuration: 5 + Math.random() * 10, // Fall duration (5-15s)
      animationDelay: Math.random() * 5, // Start delay (0-5s)
      size: 0.5 + Math.random() * 1, // Size (0.5-1.5em)
      opacity: 0.3 + Math.random() * 0.7, // Opacity (0.3-1)
      swingDuration: 2 + Math.random() * 2, // Horizontal swing (2-4s)
    }));

    setSnowflakes(flakes);
  }, [showSnow, theme]);

  if (!showSnow) return null;

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s, ${flake.swingDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            fontSize: `${flake.size}em`,
            opacity: flake.opacity,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default SnowEffect;
