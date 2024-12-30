/**
 * Validates if a given email string is in a valid format.
 *
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 * @throws {Error} If the input is null or undefined, or not a string.
 */
export const isValidEmail = (email: string): boolean => {
  if (email == null) {
    const error = new Error('Email cannot be null or undefined');
    console.error('Email validation failed:', error.message);
    throw error;
  }
  if (typeof email !== 'string') {
    const error = new Error('Email must be a string');
    console.error('Email validation failed:', error.message);
    throw error;
  }
    // Robust regex for email validation
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Formats a Date object or a date string (ISO format) into 'YYYY-MM-DD' format.
 *
 * @param {Date | string} date - The Date object or date string to format.
 * @returns {string} The formatted date string in 'YYYY-MM-DD' format.
 * @throws {Error} If the input is invalid or cannot be parsed.
 */
export const formatDate = (date: Date | string): string => {
  if (date == null) {
    const error = new Error('Date cannot be null or undefined');
    console.error('Date formatting failed:', error.message);
    throw error;
  }
  let dateObj: Date;
  if (typeof date === 'string') {
    try {
      dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date string');
      }
    } catch (error: any) {
      console.error('Date formatting failed:', error.message);
      throw new Error('Invalid date string');
    }
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
      const error = new Error('Input must be a Date object or a date string');
      console.error('Date formatting failed:', error.message);
    throw error;
  }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Generates a unique random ID string.
 *
 * @returns {string} A unique random ID string.
 */
export const generateRandomId = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timePart = Date.now().toString(36);
    return `${randomPart}${timePart}`;
};

/**
 * Calculates the progress as a percentage.
 *
 * @param {number} current - The current progress value.
 * @param {number} target - The target value.
 * @returns {number} The progress as a percentage, rounded to 2 decimal places.
 * @throws {Error} If the inputs are not numbers or target is less than 0.
 */
export const calculateProgress = (current: number, target: number): number => {
    if (typeof current !== 'number') {
      const error = new Error('Current progress must be a number');
      console.error('Progress calculation failed:', error.message);
        throw error;
    }
    if (typeof target !== 'number') {
        const error = new Error('Target must be a number');
        console.error('Progress calculation failed:', error.message);
        throw error;
    }
    if (target < 0) {
        const error = new Error('Target cannot be less than 0');
        console.error('Progress calculation failed:', error.message);
        throw error;
    }

  if (target === 0) {
    return 0;
  }
  const percentage = (current / target) * 100;
  return Math.round(percentage * 100) / 100;
};