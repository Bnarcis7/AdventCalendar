# 📤 Calendar Sharing Feature

## Overview
The advent calendar now supports an **Admin/Viewer mode** system where admins can create and configure calendars, then share them with viewers who can only interact without editing.

## How It Works

### 🔧 Admin Mode (Default)
When you create a calendar, you're in **Admin Mode** and can:
- ✅ Access the configurator
- ✅ Edit all settings (days, theme, gifts, start date)
- ✅ Share the calendar with others
- ✅ Reset the calendar
- ✅ All changes saved to localStorage

### 👁️ Viewer Mode (Shared Calendar)
When someone opens a shared calendar link, they're in **Viewer Mode** and can:
- ✅ View the calendar
- ✅ Open unlocked days
- ✅ See gifts and fireworks
- ❌ **Cannot** access configuration
- ❌ **Cannot** edit anything
- ❌ **Cannot** share (only original admin can share)
- ❌ Changes are **not** saved to their localStorage

## Sharing Your Calendar

### Step 1: Create Your Calendar
1. Configure your calendar with all settings
2. Add gifts for each day
3. Choose your theme

### Step 2: Share
1. Go to the calendar view (click "Done - View Calendar")
2. Click the **"📤 Share Calendar"** button
3. A modal will appear with two sharing options

### Step 3: Choose Sharing Method

#### Option A: Share Link (Recommended)
```
https://yoursite.com/?share=eyJkYXlzIjoyNCwidGhlbWUiOiJ...
```
- **Easiest method** - just copy and send
- Click "📋 Copy" button
- Send via email, chat, social media, etc.
- Recipients just click the link

#### Option B: Share Code
```
eyJkYXlzIjoyNCwidGhlbWUiOiJ...
```
- Alternative method for manual import
- Useful if URL is too long
- Can be pasted into import feature (if implemented)

## Technical Details

### URL Parameter Encoding
The calendar configuration is encoded in the URL using:
1. **JSON.stringify()** - Convert config to JSON string
2. **encodeURIComponent()** - URL-safe encoding
3. **btoa()** - Base64 encoding
4. **URL parameter** - Added as `?share=...`

### Share Code Format
```javascript
{
  days: 24,
  theme: 'christmas',
  title: 'My Advent Calendar',
  gifts: {
    1: 'Chocolate',
    2: 'Candy Cane',
    // ... more gifts
  },
  startDate: '2025-12-01'
}
```

### Decoding Process
When a viewer opens a shared link:
1. URL parameter `?share=` is detected
2. Base64 decoded with `atob()`
3. URI decoded with `decodeURIComponent()`
4. JSON parsed to restore config object
5. `isViewerMode` flag set to `true`
6. Configuration editing disabled

## Security Considerations

### What's Safe
- ✅ Calendar data is encoded, not encrypted
- ✅ No sensitive data should be shared
- ✅ Anyone with the link can view the calendar
- ✅ Viewer cannot modify the original calendar

### Best Practices
- 🔒 Don't put sensitive information in gifts
- 🔒 Share links only with intended recipients
- 🔒 Links are public - anyone with link can access
- 🔒 Consider the share link as "public read-only"

## User Experience

### Admin View
```
┌─────────────────────────────────────┐
│   🎄 My Advent Calendar 🎄          │
│                                     │
│  🔓 Click unlocked days...          │
│  🔒 Locked days will unlock...      │
│                                     │
│  [⚙️ Edit Configuration]            │
│  [📤 Share Calendar]                │
│                                     │
│  [Calendar Grid...]                 │
└─────────────────────────────────────┘
```

### Viewer View
```
┌─────────────────────────────────────┐
│   🎄 My Advent Calendar 🎄          │
│                                     │
│  🔓 Click unlocked days...          │
│  🔒 Locked days will unlock...      │
│  👁️ Viewing shared calendar        │
│                                     │
│  [Calendar Grid...]                 │
└─────────────────────────────────────┘
```

## Share Modal Features

### UI Components
1. **Share Link Section**
   - Full URL with share code
   - One-click copy button
   - Success feedback ("✓ Copied!")

2. **Share Code Section**
   - Truncated preview of the code
   - Copy button for the full code
   - Alternative sharing method

3. **Information Panel**
   - What viewers can do
   - What viewers cannot do
   - Clear permissions list

4. **Close Button**
   - Returns to calendar view
   - Share modal is overlay

### Copy Functionality
```javascript
navigator.clipboard.writeText(shareURL)
```
- Uses modern Clipboard API
- Shows "✓ Copied!" feedback
- Resets after 2 seconds
- Works on all modern browsers

## Implementation Details

### Context Changes
```javascript
// CalendarContext.jsx
const [isViewerMode, setIsViewerMode] = useState(false);

// Check for shared calendar on load
const urlParams = new URLSearchParams(window.location.search);
const shareCode = urlParams.get('share');
if (shareCode) {
  // Decode and load shared config
  setIsViewerMode(true);
}
```

### Protected Functions
All edit functions check `isViewerMode`:
```javascript
const updateConfig = (updates) => {
  if (isViewerMode) return; // Block in viewer mode
  setCalendarConfig(prev => ({ ...prev, ...updates }));
};
```

### Conditional Rendering
```jsx
{!isViewerMode && (
  <div className="admin-buttons">
    <button onClick={handleEdit}>⚙️ Edit</button>
    <button onClick={handleShare}>📤 Share</button>
  </div>
)}

{isViewerMode && (
  <p className="viewer-badge">👁️ Viewing shared calendar</p>
)}
```

## Future Enhancements

### Potential Features
- 🔮 Password-protected calendars
- 🔮 Expiration dates for shared links
- 🔮 Analytics (view counts)
- 🔮 Multiple calendar management
- 🔮 QR code generation
- 🔮 Social media sharing buttons
- 🔮 Embed code for websites
- 🔮 Import calendar from code

### Advanced Sharing
- Server-side storage with short URLs
- Calendar templates library
- Public calendar gallery
- Collaborative editing

## Troubleshooting

### Link Doesn't Work
- ✓ Check the full URL was copied
- ✓ Ensure no characters were cut off
- ✓ Try copying the share code instead

### Configuration Won't Load
- ✓ Check browser console for errors
- ✓ Verify the share code is valid
- ✓ Try regenerating the share link

### Changes Don't Save (Viewer)
- ℹ️ This is expected behavior
- ℹ️ Viewers cannot save changes
- ℹ️ Only admins can modify calendars

---

**Happy Sharing!** 🎉✨
