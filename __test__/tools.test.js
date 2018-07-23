const tools = require('../src')({ bucket: 'printawesome' })
const fs = require('fs')
const path = require('path')

const log = promise => promise
  .then(r => console.log(r))
  .catch(e => console.log(e))

it('get', () => {
  expect.assertions(1)
  return tools.get({ key: 'test.txt' })
    .then(tools.text)
    .then(data =>
      expect(data).toMatch('hello')
    )
  log(promise)
})

it ('append', () => {
  expect.assertions(1)
    return tools
      .append('another line', { key: 'test.txt' })
      .then(() => {
        return tools.get({ key: 'test.txt' })
        .then(tools.text)
        .then(data =>
          expect(data).toMatch('hello\nanother line')
        )
      })
})

it ('upload', () => {
  return tools.upload(
    fs.createReadStream(path.join(__dirname, 'file.txt')), 
    { key: 'file.txt' }
  ).then(data => {

  })
})
  // it('s3Tools.append', function(done) {
  //  let tools = s3Tools({ bucket: 'printawesome' })
  //  let promise = tools.append('another line', { key: 'test.txt' })
  //  log(promise)
  //  promise.should.eventually.be.fulfilled.notify(done)
  // })


  // it('put', function(done) {    
  //  const stream = fs.createReadStream(
  //    path.join(
  //      __dirname, 'test.txt'
  //    )
  //  )
  //  return tools.upload(stream, {
  //    key: 'test.txt',
  //    tags: [{ Key: 'tag1', Value: 'value1' }]
  //  })
  // })
