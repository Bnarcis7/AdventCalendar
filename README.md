# Advent Calendar Configurator

A beautiful, interactive web application for creating and customizing advent calendars with multiple themes!

## Features

### 🎨 Multiple Themes
- **Christmas** 🎄 - Traditional red and green with snowflakes
- **Halloween** 🎃 - Spooky orange and black with bats
- **Birthday** 🎂 - Colorful pink and blue with balloons
- **Valentine** 💝 - Romantic pink with hearts
- **Easter** 🐰 - Pastel colors with eggs
- **New Year** 🎆 - Gold and navy with sparkles
- **Summer** ☀️ - Bright yellow and blue beach theme

### ⚙️ Configurator (Admin Mode)
- Set custom number of days (1-365)
- Configure start date
- Set calendar title
- Choose theme
- Add personalized gifts for each day
- All configurations saved to browser localStorage
- **📤 Share calendar** with others via link or code

### 👁️ Viewer Mode
- **Share your configured calendar** with anyone
- Viewers can open days and see gifts
- **Viewers cannot edit** or change configuration
- Shared via URL parameter (no server needed)
- Perfect for sharing with family, friends, or teams

### 🎁 Calendar Display
- Beautiful animated doors for each day
- Click to reveal gifts
- **🎆 Fireworks animation** when opening a day
- **🔒 Date-based locking** - days unlock on their actual date
- **🎄 Christmas decorations** on locked doors (bells, trees, ornaments, stars)
- **🎵 Music player** at bottom playing Jingle Bells on repeat
- Themed decorations that float across the screen
- Responsive design for all screen sizes
- Smooth animations and transitions
- Visual indicators for days with gifts (✨)

## Getting Started

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm

### Installation

1. Clone the repository or navigate to the project folder
2. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## How to Use

### For Admins (Creating Calendars)

1. **Configure Your Calendar**
   - When you first open the app, you'll see the configurator
   - Set your calendar title, number of days, and start date
   - Choose a theme from the dropdown
   - Click on "Add Gift" for each day to set surprises
   - Click "Done - View Calendar" when finished

2. **View Your Calendar**
   - See all your calendar doors displayed in a grid
   - Click on any door to reveal its gift
   - Doors with gifts have a sparkle indicator (✨)
   - Enjoy the themed animations and decorations!

3. **Share Your Calendar** 📤
   - Click the "📤 Share Calendar" button
   - Copy the generated link or share code
   - Send it to anyone you want to share with
   - They can view and interact, but cannot edit

4. **Edit Configuration**
   - Click the "⚙️ Edit Configuration" button to go back to the configurator
   - Make changes and save again

5. **Reset Everything**
   - Use the "Reset All" button in the configurator to start fresh

### For Viewers (Viewing Shared Calendars)

1. **Open Shared Link**
   - Click on the link shared with you
   - Calendar loads automatically in viewer mode

2. **Interact with Calendar**
   - Click unlocked days to reveal gifts
   - Enjoy fireworks and animations
   - See the theme chosen by the creator

3. **View Only**
   - You cannot edit the configuration
   - You cannot change theme or gifts
   - This is by design to preserve the creator's setup

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations
- **LocalStorage** - Data persistence

## Project Structure

```
src/
├── components/
│   ├── Calendar.jsx          # Main calendar display
│   ├── Calendar.css           # Calendar styles
│   ├── Configurator.jsx       # Configuration UI
│   └── Configurator.css       # Configurator styles
├── context/
│   └── CalendarContext.jsx    # React Context for state management
├── data/
│   └── themes.js              # Theme definitions
├── App.jsx                    # Main app component
├── App.css                    # App styles
├── index.css                  # Global styles
└── main.jsx                   # Entry point
```

---

Made with ❤️ using React and Vite
