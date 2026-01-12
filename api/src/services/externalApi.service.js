const fetch = require('node-fetch')
const { ExternalServiceError } = require('../errors/errors')

const BASE_URL = 'https://echo-serv.tbxnet.com/v1/secret'
const API_KEY = 'Bearer aSuperSecretKey'

/**
 * Retrieves the list of available files from the external API
 * @returns {Array} - An array of file names
 */
async function getFilesList () {
  const response = await fetchExternal('/files')

  if (!response.ok) {
    throw new ExternalServiceError(
      `External service error (${response.statusText})`
    )
  }

  const data = await response.json()
  const files = data.files ?? []

  return files
}

/**
 * Retrieves the content of a specific file
 * @param {string} fileName - The name of the file to retrieve
 * @returns {string} - The raw content of the file
 */
async function getFileContent (fileName) {
  const response = await fetchExternal(`/file/${fileName}`)

  if (!response.ok) {
    throw new ExternalServiceError(
      `External service error (${response.statusText})`
    )
  }

  return response.text()
}

/**
 * Makes a request to the external API
 * @param {string} endpoint - The API endpoint to fetch
 * @returns {Response} - The fetch response object
 */
async function fetchExternal (endpoint) {
  let response

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { authorization: API_KEY }
    })
  } catch {
    throw new ExternalServiceError('External service unreachable')
  }

  if (response.status === 404) {
    throw new ExternalServiceError('File not found in external service')
  }

  if (response.status === 401 || response.status === 403) {
    throw new ExternalServiceError('Unauthorized external service')
  }

  return response
}

module.exports = { getFilesList, getFileContent }
