const API_BASE_URL = '/files'

/**
 * GET /files/list – Fetches and returns the list of available files from the external API.
 * @returns {Array} - The list of available files
 */
async function getFilesList () {
  const response = await fetch(`${API_BASE_URL}/list`)
  return handleResponse(response)
}

/**
 * GET /files/data – Retrieves, parses and returns formatted data from one or all CSV files.
 * @param {string|null} fileName - Optional file name to filter by
 * @returns {Object} - The formatted data from the files
 */
async function getFilesData (fileName = null) {
  let url = `${API_BASE_URL}/data`

  if (fileName) {
    url += `?fileName=${encodeURIComponent(fileName)}`
  }

  const response = await fetch(url)
  return handleResponse(response)
}

/**
 * Handles the fetch response, checking for errors and parsing JSON.
 * @param {Response} response - The fetch response object
 * @returns {Object} - The parsed JSON data
 * @throws {Error} - If the response is not ok, throws an error with the message from the response
 */
async function handleResponse (response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'An unexpected error occurred')
  }
  return response.json()
}

export { getFilesList, getFilesData }
