const {
  getFilesList: _getFilesList,
  getFileContent
} = require('../services/externalApi.service')
const { parseCSV } = require('../services/csvParser.service')
const { ValidationError, NotFoundError } = require('../errors/errors')

/**
 * GET /files/list – Fetches and returns the list of available files from the external API.
 */
async function getFilesList (req, res, next) {
  try {
    const files = await _getFilesList()
    res.json({ files })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /files/data – Retrieves, parses and returns formatted data from one or all CSV files.
 *
 * Query params:
 *   - fileName: filters by a specific file name
 */
async function getFilesData (req, res, next) {
  try {
    const fileName = validateQueryParams(req.query)

    const files = await getFilteredFiles(fileName)
    const results = await processFiles(files)

    const formattedData = formatResults(results)

    res.json(formattedData)
  } catch (error) {
    next(error)
  }
}

/**
 * Validates query parameters and ensures only supported filters are provided.
 * @param {Object} reqParams - The request query parameters
 * @returns {string|null} - The validated parameter or null if not provided
 */
function validateQueryParams (reqParams) {
  const allowedQueryParams = ['fileName']

  for (const key of Object.keys(reqParams)) {
    if (!allowedQueryParams.includes(key)) {
      throw new ValidationError(`Unknown query parameter: ${key}`)
    }
  }

  const { fileName } = reqParams

  return fileName
}

/**
 * Retrieves the file list and applies an optional filter by file name.
 * @param {string|null} fileName - The file name to filter by (optional)
 * @returns {string[]} - The list of files to process
 */
async function getFilteredFiles (fileName) {
  let files = await _getFilesList()

  if (fileName) {
    files = files.filter((file) => file === fileName)

    if (files.length === 0) {
      throw new NotFoundError(`File '${fileName}' not found`)
    }
  }

  return files
}

/**
 * Downloads and parses all provided files concurrently.
 * @param {string[]} files - The list of file names to process
 * @returns {Promise<Array>} - An array of results containing file names and their parsed lines
 */
async function processFiles (files) {
  return Promise.allSettled(
    files.map(async (file) => {
      const csvContent = await getFileContent(file)
      const lines = parseCSV(csvContent, file)
      return { file, lines }
    })
  )
}

/**
 * Extracts and returns only successful results containing valid parsed lines.
 * @param {Array} results - The array of results from processing files
 * @returns {Array} - An array of formatted file data
 */
function formatResults (results) {
  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
    .filter((item) => item.lines.length > 0)
}

module.exports = { getFilesData, getFilesList }
