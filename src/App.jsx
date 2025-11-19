import { CalendarProvider, useCalendar } from './context/CalendarContext'
import Calendar from './components/Calendar'
import Configurator from './components/Configurator'
import './App.css'

function AppContent() {
  const { isConfiguring, isViewerMode } = useCalendar();

  return (
    <div className="app">
      {/* Only show configurator if not in viewer mode */}
      {isConfiguring && !isViewerMode ? <Configurator /> : <Calendar />}
    </div>
  );
}

function App() {
  return (
    <CalendarProvider>
      <AppContent />
    </CalendarProvider>
  );
}

export default App
