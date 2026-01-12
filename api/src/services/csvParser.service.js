/**
 * Parses the full CSV content and returns formatted valid lines
 * @param {string} csvContent - The raw CSV content as a string
 * @param {string} fileName - The name of the file being parsed
 * @returns {Array} - An array of valid parsed lines
 */
function parseCSV (csvContent, fileName) {
  if (!csvContent || csvContent.trim() === '') return []

  const lines = csvContent.split('\n')

  // Skip header line
  const dataLines = lines.slice(1)

  const validLines = []

  for (const line of dataLines) {
    const parsed = parseLine(line)

    if (parsed && isValidLine(parsed, fileName)) {
      validLines.push({
        text: parsed.text,
        number: Number(parsed.number),
        hex: parsed.hex
      })
    }
  }

  return validLines
}

/**
 * Parses a single CSV line
 * @param {string} line - A single line from the CSV
 * @returns {Object|null} - An object with parsed fields or null if invalid
 */
function parseLine (line) {
  if (!line || line.trim() === '') return null

  const parts = line.split(',')

  if (parts.length !== 4) return null

  return {
    file: parts[0],
    text: parts[1],
    number: parts[2],
    hex: parts[3]
  }
}

/**
 * Validates a parsed CSV line
 * @param {Object} line - The parsed line object
 * @param {string} expectedFile - The expected file name for validation
 * @returns {boolean} - True if the line is valid, false otherwise
 */
function isValidLine (line, expectedFile) {
  if (!line.file || !line.text || !line.hex) return false

  if (line.file !== expectedFile) return false

  if (line.text.trim() === '') return false

  if (!isValidNumber(line.number)) return false

  if (!isValidHex(line.hex)) return false

  return true
}

/**
 * Validates whether a value is a valid number
 * @param {string} value - The value to validate
 * @returns {boolean} - True if the value is a valid number, false otherwise
 */
function isValidNumber (value) {
  if (value === undefined || value === null || value === '') return false
  const num = Number(value)
  return !isNaN(num) && Number.isFinite(num)
}

/**
 * Validates whether a hexadecimal value is valid (32 characters)
 * @param {string} hex - The hexadecimal value to validate
 * @returns {boolean} - True if the hex is valid, false otherwise
 */
function isValidHex (hex) {
  if (typeof hex !== 'string') return false
  return /^[a-f0-9]{32}$/i.test(hex)
}

module.exports = { parseCSV, parseLine }
