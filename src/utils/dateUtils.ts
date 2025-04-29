/**
 * Format a date string to a human-readable format
 */
export const formatDate = (dateString: string, includeTime: boolean = true): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a date range from start and end date strings
 */
export const formatDateRange = (startDateString: string, endDateString: string): string => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  
  // If same day
  if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()
  ) {
    return formatDate(startDateString, false);
  }
  
  // If same month and year
  if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()
  ) {
    return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getFullYear()}`;
  }
  
  // If same year
  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getDate()} - ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  
  // Different years
  return `${formatDate(startDateString, false)} - ${formatDate(endDateString, false)}`;
};