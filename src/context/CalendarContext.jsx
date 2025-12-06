import { createContext, useContext, useState, useEffect } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [isViewerMode, setIsViewerMode] = useState(false);
  
  const [calendarConfig, setCalendarConfig] = useState(() => {
    // Check if there's a shared calendar in URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareCode = urlParams.get('share');
    
    if (shareCode) {
      try {
        const decoded = decodeURIComponent(atob(shareCode));
        const sharedConfig = JSON.parse(decoded);
        setIsViewerMode(true);
        return sharedConfig;
      } catch (e) {
        console.error('Invalid share code');
      }
    }
    
    // Otherwise load from localStorage
    const saved = localStorage.getItem('adventCalendarConfig');
    return saved ? JSON.parse(saved) : {
      days: 24,
      theme: 'christmas',
      title: 'My Advent Calendar',
      gifts: {},
      riddles: {}, // New: { dayNumber: { riddle: "question", answer: "answer" } }
      startDate: new Date().toISOString().split('T')[0],
      manuallyUnlockedDays: []
    };
  });

  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    // Only save to localStorage if not in viewer mode
    if (!isViewerMode) {
      localStorage.setItem('adventCalendarConfig', JSON.stringify(calendarConfig));
    }
  }, [calendarConfig, isViewerMode]);

  const updateConfig = (updates) => {
    if (isViewerMode) return; // Prevent edits in viewer mode
    setCalendarConfig(prev => ({ ...prev, ...updates }));
  };

  const setGiftForDay = (day, gift) => {
    if (isViewerMode) return; // Prevent edits in viewer mode
    setCalendarConfig(prev => ({
      ...prev,
      gifts: {
        ...prev.gifts,
        [day]: gift
      }
    }));
  };

  const setRiddleForDay = (day, riddleData) => {
    if (isViewerMode) return;
    setCalendarConfig(prev => ({
      ...prev,
      riddles: {
        ...prev.riddles,
        [day]: riddleData
      }
    }));
  };

  const toggleManualUnlock = (day) => {
    if (isViewerMode) return;
    setCalendarConfig(prev => {
      const manuallyUnlockedDays = prev.manuallyUnlockedDays || [];
      const isCurrentlyUnlocked = manuallyUnlockedDays.includes(day);
      
      return {
        ...prev,
        manuallyUnlockedDays: isCurrentlyUnlocked
          ? manuallyUnlockedDays.filter(d => d !== day)
          : [...manuallyUnlockedDays, day]
      };
    });
  };

  const resetCalendar = () => {
    if (isViewerMode) return; // Prevent reset in viewer mode
    setCalendarConfig({
      days: 24,
      theme: 'christmas',
      title: 'My Advent Calendar',
      gifts: {},
      riddles: {},
      startDate: new Date().toISOString().split('T')[0],
      manuallyUnlockedDays: []
    });
  };

  return (
    <CalendarContext.Provider value={{
      calendarConfig,
      updateConfig,
      setGiftForDay,
      setRiddleForDay,
      resetCalendar,
      toggleManualUnlock,
      isConfiguring,
      setIsConfiguring,
      isViewerMode
    }}>
      {children}
    </CalendarContext.Provider>
  );
};
