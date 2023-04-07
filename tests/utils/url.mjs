/**
 * Check (absolute) URL invalidity by trying to create a URL object.
 *
 * @param {string} url
 *
 * @returns {boolean}
 */
export const isInvalidUrl = url => {
  try { new URL(url); return false }
  catch (error) { return true }
}
