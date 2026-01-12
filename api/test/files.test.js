const chai = require('chai')
const nock = require('nock')

const { app } = require('../src/app.js')

// Helpers for request
const { request: _request } = require('http')
const { expect } = chai

function makeRequest (path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'GET',
      headers: { accept: 'application/json' }
    }

    const req = _request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: JSON.parse(data)
        })
      })
    })

    req.on('error', reject)
    req.end()
  })
}

describe('Files API', function () {
  let server

  before(function (done) {
    server = app.listen(3001, done)
  })

  after(function (done) {
    server.close(done)
  })

  beforeEach(function () {
    nock.cleanAll()
  })

  describe('GET /files/list', function () {
    it('should return list of files = require external API', async function () {
      // Mock external API
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] })

      const response = await makeRequest('/files/list')

      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('files')
      expect(response.body.files).to.be.an('array')
      expect(response.body.files).to.deep.equal(['file1.csv', 'file2.csv'])
    })

    it('should handle external API errors', async function () {
      nock('https://echo-serv.tbxnet.com').get('/v1/secret/files').reply(500)

      const response = await makeRequest('/files/list')

      expect(response.status).to.equal(502)
      expect(response.body).to.have.property('error')
    })
  })

  describe('GET /files/data', function () {
    it('should return formatted data = require CSV files', async function () {
      const csvContent = `file,text,number,hex
file1.csv,HelloWorld,12345,70ad29aacf0b690b0467fe2b2767f765
file1.csv,TestText,99999,d33a8ca5d36d3106219f66f939774cf5`

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] })

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, csvContent)

      const response = await makeRequest('/files/data')

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body).to.have.lengthOf(1)
      expect(response.body[0]).to.have.property('file', 'file1.csv')
      expect(response.body[0]).to.have.property('lines')
      expect(response.body[0].lines).to.have.lengthOf(2)
      expect(response.body[0].lines[0]).to.deep.equal({
        text: 'HelloWorld',
        number: 12345,
        hex: '70ad29aacf0b690b0467fe2b2767f765'
      })
    })

    it('should filter by fileName query param', async function () {
      const csvContent = `file,text,number,hex
file1.csv,Test,123,70ad29aacf0b690b0467fe2b2767f765`

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] })

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, csvContent)

      const response = await makeRequest('/files/data?fileName=file1.csv')

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body).to.have.lengthOf(1)
      expect(response.body[0].file).to.equal('file1.csv')
    })

    it('should skip invalid lines', async function () {
      const csvContent = `file,text,number,hex
file1.csv,Valid,123,70ad29aacf0b690b0467fe2b2767f765
file1.csv,,456,70ad29aacf0b690b0467fe2b2767f765
file1.csv,Invalid,notanumber,70ad29aacf0b690b0467fe2b2767f765
file1.csv,BadHex,789,invalidhex`

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv'] })

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(200, csvContent)

      const response = await makeRequest('/files/data')

      expect(response.status).to.equal(200)
      expect(response.body[0].lines).to.have.lengthOf(1)
      expect(response.body[0].lines[0].text).to.equal('Valid')
    })

    it('should handle empty files', async function () {
      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['empty.csv'] })

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/empty.csv')
        .reply(200, '')

      const response = await makeRequest('/files/data')

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      expect(response.body).to.have.lengthOf(0)
    })

    it('should continue processing if one file fails', async function () {
      const csvContent = `file,text,number,hex
file2.csv,Test,123,70ad29aacf0b690b0467fe2b2767f765`

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/files')
        .reply(200, { files: ['file1.csv', 'file2.csv'] })

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file1.csv')
        .reply(500)

      nock('https://echo-serv.tbxnet.com')
        .get('/v1/secret/file/file2.csv')
        .reply(200, csvContent)

      const response = await makeRequest('/files/data')

      expect(response.status).to.equal(200)
      expect(response.body).to.have.lengthOf(1)
      expect(response.body[0].file).to.equal('file2.csv')
    })
  })

  describe('GET /health', function () {
    it('should return health status', async function () {
      const response = await makeRequest('/health')

      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('status', 'ok')
      expect(response.body).to.have.property('timestamp')
    })
  })
})
