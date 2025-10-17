/**
 * Check (absolute) URL invalidity by trying to create a URL object.
 *
 * @param {string} url
 *
 * @returns {boolean}
 */
export const isInvalidUrl = url => {
  try {
    new URL(url)
    return false
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return true
  }
}

/**
 * An `href` attribute is a valid anchor link if it starts by `#` followed by
 * at least one character (hence `url.hash.length > 1`).
 *
 * @param {string} hash
 *
 * @returns {boolean}
 */
export const isAnchorLink = hash => {
  const urlStr = `http://a${hash}`
  const url = new URL(urlStr)

  return url.hash.length > 1 && urlStr == `${url.origin}${url.hash}`
}

/**
 * Opposite of `isAnchorLink`.
 *
 * @param {string} hash
 *
 * @returns {boolean}
 */
export const isNotAnchorLink = hash => !isAnchorLink(hash)

/**
 * Gather all `href` attributes from `<a>` elements.
 *
 * We use `.getAttribute('href')` instead of `.href` because the latter one
 * resolves to a relative URL when the URL protocol is missing. It works
 * for this website where all the links are expected to be external.
 *
 * - `link.getAttribute('href')`: 'something' (invalid URL)
 * - resolved `link.href`: 'http://127.0.0.1:5173/something' (valid URL)
 *
 * @param {[SVGElement|HTMLElement]} $els
 */
export const getAllHrefAttr = $els => $els.map(link => link.getAttribute('href'))
