# 📅 Date-Based Unlocking - How It Works

## Overview

The calendar automatically unlocks days based on real dates, so users can only open days that have arrived or passed.

## ✅ The Logic

### Core Function
```javascript
const isDayUnlocked = (day) => {
  const startDate = new Date(calendarConfig.startDate);
  const dayDate = new Date(startDate);
  dayDate.setDate(startDate.getDate() + (day - 1));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dayDate.setHours(0, 0, 0, 0);
  return dayDate <= today;
};
```

### How It Works

1. **Start Date** - The base date you configure
2. **Day Calculation** - Each day number maps to a date:
   - Day 1 = Start Date
   - Day 2 = Start Date + 1 day
   - Day 3 = Start Date + 2 days
   - etc.
3. **Comparison** - Checks if day's date ≤ today
4. **Result** - Returns `true` (unlocked) or `false` (locked)

## 📅 Example Scenarios

### Scenario 1: November Calendar (Your Example)

**Configuration:**
- Start Date: November 1, 2025
- Number of Days: 30
- Today's Date: November 19, 2025

**Result:**

| Day | Date | Status | Can Open? |
|-----|------|--------|-----------|
| 1 | Nov 1 | Past | ✅ YES |
| 2 | Nov 2 | Past | ✅ YES |
| 3 | Nov 3 | Past | ✅ YES |
| ... | ... | ... | ... |
| 18 | Nov 18 | Past | ✅ YES |
| **19** | **Nov 19** | **TODAY** | ✅ **YES** |
| 20 | Nov 20 | Future | 🔒 NO |
| 21 | Nov 21 | Future | 🔒 NO |
| ... | ... | ... | ... |
| 30 | Nov 30 | Future | 🔒 NO |

**Summary:** Days 1-19 are unlocked (including today), Days 20-30 are locked.

### Scenario 2: Traditional Advent Calendar

**Configuration:**
- Start Date: December 1, 2025
- Number of Days: 24
- Today's Date: December 10, 2025

**Result:**

| Day | Date | Status | Can Open? |
|-----|------|--------|-----------|
| 1 | Dec 1 | Past | ✅ YES |
| 2 | Dec 2 | Past | ✅ YES |
| ... | ... | ... | ... |
| 9 | Dec 9 | Past | ✅ YES |
| **10** | **Dec 10** | **TODAY** | ✅ **YES** |
| 11 | Dec 11 | Future | 🔒 NO |
| ... | ... | ... | ... |
| 24 | Dec 24 | Future | 🔒 NO |

**Summary:** Days 1-10 are unlocked, Days 11-24 are locked.

### Scenario 3: Birthday Countdown (1 Week)

**Configuration:**
- Start Date: November 13, 2025
- Number of Days: 7
- Today's Date: November 19, 2025

**Result:**

| Day | Date | Status | Can Open? |
|-----|------|--------|-----------|
| 1 | Nov 13 | Past | ✅ YES |
| 2 | Nov 14 | Past | ✅ YES |
| 3 | Nov 15 | Past | ✅ YES |
| 4 | Nov 16 | Past | ✅ YES |
| 5 | Nov 17 | Past | ✅ YES |
| 6 | Nov 18 | Past | ✅ YES |
| **7** | **Nov 19** | **TODAY** | ✅ **YES** |

**Summary:** ALL days are unlocked! Birthday is today! 🎂

### Scenario 4: Future Calendar

**Configuration:**
- Start Date: December 15, 2025
- Number of Days: 10
- Today's Date: November 19, 2025

**Result:**

| Day | Date | Status | Can Open? |
|-----|------|--------|-----------|
| 1 | Dec 15 | Future | 🔒 NO |
| 2 | Dec 16 | Future | 🔒 NO |
| ... | ... | ... | ... |
| 10 | Dec 24 | Future | 🔒 NO |

**Summary:** ALL days are locked (calendar starts in the future).

## 🕐 Time Handling

### Midnight Reset
```javascript
today.setHours(0, 0, 0, 0);
dayDate.setHours(0, 0, 0, 0);
```

- All times are set to midnight (00:00:00.000)
- This ensures days unlock at the start of the day
- No partial-day issues
- Clean date comparison

### Automatic Updates

The calendar checks dates **every time you click** a door:
- No need to refresh the page
- Days automatically become available at midnight
- Real-time date checking

## 🎯 Visual Indicators

### Unlocked Days
- ✅ Normal colors
- ✨ Sparkle if gift present
- 👆 Clickable cursor
- 🎆 Opens with fireworks

### Locked Days (Future)
- 🔒 Lock icon in center
- 🔔 Swinging bells
- 🎄 Growing tree
- 🎀 Bouncing ornaments
- ⭐ Twinkling stars
- 🚫 Not-allowed cursor
- 📉 Darker/desaturated
- 📳 Shakes when clicked

### Today's Day
- ✅ Unlocked (can open)
- 🎯 Same as other unlocked days
- 💫 No special highlighting (yet!)
  - *Future enhancement idea: highlight current day*

## 🧪 Testing Guide

### Test 1: Current Month
1. Set start date to the 1st of current month
2. Set days to match month length (28-31)
3. View calendar
4. **Expected:** Days 1 through today should be unlocked

### Test 2: Past Month
1. Set start date to last month
2. Set days to 30
3. View calendar
4. **Expected:** ALL days should be unlocked

### Test 3: Future Month
1. Set start date to next month
2. Set days to 30
3. View calendar
4. **Expected:** ALL days should be locked

### Test 4: Mixed Period
1. Set start date to 10 days ago
2. Set days to 20
3. View calendar
4. **Expected:** First ~10 days unlocked, rest locked

### Test 5: Edge Case - Today
1. Set start date to TODAY
2. Set days to 7
3. View calendar
4. **Expected:** Day 1 unlocked, Days 2-7 locked

## 🔄 Dynamic Behavior

### What Happens Over Time

**Day 1 (Nov 1):**
- User creates calendar with start date Nov 1
- Only Day 1 is unlocked
- Days 2-30 are locked

**Day 2 (Nov 2):**
- User opens calendar again
- Days 1-2 are now unlocked
- Days 3-30 are locked

**Day 19 (Nov 19 - Today):**
- User opens calendar
- Days 1-19 are unlocked
- Days 20-30 are locked

**Day 30 (Nov 30):**
- User opens calendar
- ALL days are unlocked
- Calendar is complete!

## 💡 Use Cases

### Daily Unlock Pattern
Perfect for:
- 📅 Advent calendars (December countdown)
- 🎂 Birthday countdowns
- 🎄 Holiday countdowns
- 📚 Learning calendars (daily lessons)
- 💪 Fitness challenges (daily workouts)
- 🎯 Goal tracking (daily milestones)

### All-At-Once Pattern
For retroactive calendars:
- Set start date in the past
- All days immediately unlocked
- Great for testing or reviewing

### Future Calendar Pattern
For advance planning:
- Set start date in the future
- All days locked initially
- Builds anticipation

## 🎁 Combined with Gifts

The unlocking system works perfectly with gifts:

```
Day 1 (Nov 1) - UNLOCKED
├─ Has Gift: "Chocolate" ✨
└─ Can open and see: ✅

Day 19 (Nov 19) - UNLOCKED (TODAY)
├─ Has Gift: "Special Surprise" ✨
└─ Can open and see: ✅

Day 20 (Nov 20) - LOCKED 🔒
├─ Has Gift: "Mystery Gift" ✨
└─ Cannot open yet: ❌ (decorations show)
```

## 📊 Summary

✅ **Past days** (before today) → UNLOCKED
✅ **Today** → UNLOCKED
🔒 **Future days** (after today) → LOCKED

The system is **already implemented and working**!

## 🎮 Try It Now!

1. Open the calendar at: http://127.0.0.1:5174/
2. Click "⚙️ Edit Configuration"
3. Set start date to November 1, 2025
4. Set days to 30
5. Add some gifts
6. Click "Done - View Calendar"
7. **Result:** Days 1-19 are unlocked (including today Nov 19)! 🎉

---

**Your calendar automatically respects real-world dates!** 📅✨
