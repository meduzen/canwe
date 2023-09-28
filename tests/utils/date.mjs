/**
 * Convert `2023-03-02T16:59:31` into `2023-03-02-16-59-31`.
 *
 * @param {Date} date
 *
 * @returns {string}
 */
export const dateToKebab = date => date
  .toISOString()
  .substr(0, 19)
  .replace('T', '-')
  .replaceAll(':', '-')
