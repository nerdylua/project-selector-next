'use client';

// Timer Configuration
export const TIMER_CONFIG = {
  START_TIME: (() => {
    const date = new Date();
    date.setHours(1, 0, 0, 0); // 1:00 AM today
    return date;
  })(),
  END_TIME: (() => {
    const date = new Date();
    date.setDate(date.getDate()); // Tomorrow
    date.setHours(17, 0, 0, 0); // 5:00 PM today
    return date;
  })(),
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

const isFormOpen = () => {
  const now = new Date();
  const { START_TIME, END_TIME } = TIMER_CONFIG;
  // Convert all times to timestamps for comparison
  const nowTime = now.getTime();
  const startTime = START_TIME.getTime();
  const endTime = END_TIME.getTime();

  return nowTime >= startTime && nowTime < endTime;
};

const formIsOpen = isFormOpen();