'use client';

// Timer Configuration
export const TIMER_CONFIG = {
  START_TIME: new Date(0),
  END_TIME: new Date(8640000000000000) 
} as const;

export const FORMATTED_START_TIME = "Form is always open";
export const FORMATTED_END_TIME = "∞"; 

const isFormOpen = () => true;

const formIsOpen = isFormOpen();
