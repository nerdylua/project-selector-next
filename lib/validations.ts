import { z } from "zod";

// USN validation schema
export const usnSchema = z.string().refine(
  (usn) => {
    // Matches pattern: 1RV followed by either 23 or 24, then IS followed by 3 digits
    const usnPattern = /^1RV(23|24)IS[0-9]{3}$/;
    return usnPattern.test(usn);
  },
  "Please enter a valid USN (e.g., 1RV23IS001 or 1RV24IS001)"
); 