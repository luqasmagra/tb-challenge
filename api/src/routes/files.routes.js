const { Router } = require('express')
const {
  getFilesData,
  getFilesList
} = require('../controllers/files.controller')

const router = Router()

// GET /files/data - Retrieves all formatted files
// GET /files/data?fileName=file1.csv - Filters by file name
router.get('/data', getFilesData)

// GET /files/list - List available files
router.get('/list', getFilesList)

module.exports = { router }
