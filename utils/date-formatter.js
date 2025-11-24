/**
 * Date formatting utilities
 * Handles parsing and formatting dates while avoiding timezone issues
 */

/**
 * Format a date string (YYYY-MM-DD) to "Mon. YYYY" format
 * Parses date components directly to avoid timezone conversion issues
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date like "Jan. 2021"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  // Parse date components directly to avoid timezone issues
  const [year, month] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  return `${monthName}. ${year}`;
}

/**
 * Format a date range to "Mon. YYYY - Mon. YYYY" or "Mon. YYYY - Present"
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format (optional)
 * @returns {string} Formatted date range
 */
export function formatDateRange(startDate, endDate) {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
}

/**
 * Extract year from a date string (YYYY-MM-DD)
 * Parses year directly to avoid timezone conversion issues
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {number} The year
 */
export function formatYear(dateStr) {
  if (!dateStr) return '';
  const [year] = dateStr.split('-').map(Number);
  return year;
}
