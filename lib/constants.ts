'use client';

// Timer Configuration
export const TIMER_CONFIG = {
  START_TIME: new Date("2025-03-12T19:30:00"), // 7 PM today
  END_TIME: new Date("2025-03-13T9:00:00"),   // 9 AM tomorrow
} as const;

// Format the dates for display
export const FORMATTED_START_TIME = TIMER_CONFIG.START_TIME.toLocaleString('en-IN', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZone: 'Asia/Kolkata'
});

export const FORMATTED_END_TIME = TIMER_CONFIG.END_TIME.toLocaleString('en-IN', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZone: 'Asia/Kolkata'
}); 