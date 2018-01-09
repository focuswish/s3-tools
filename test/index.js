//const debug = require('debug')('s3-tools')
//var args = {
//  bucket: 'printawesome', 
//  key: 'lorem3/test.txt',
//}
//var s3 = require('../lib')({region: 'us-east-1'})

//s3.getSignedUrl('getObject').then(resp => debug('1: ',resp))
//s3.getObjectTagging().then(resp => debug('2: ', resp))
//s3.getObject()().then(resp => debug('3: ', resp))
//s3.promisify('getObject')().then(resp => debug('4: ',resp))

//s3.promisify('getObject')(args).then(resp => console.log(resp))

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should();

chai.use(chaiAsPromised)

let { tools: s3Tools } = require('../dist')

const fs = require('fs');
const path = require('path');

const log = promise => promise
  .then(r => console.log(r))
  .catch(e => console.log(e))

describe('s3Tools.get', function() {
  it('s3Tools.get', function(done) {
    let tools = s3Tools({ bucket: 'printawesome' })
    let promise = tools.get({key: 'test.txt'}).text()
    log(promise)

    promise.should.eventually.be.fulfilled.notify(done)
  })
})

describe('s3Tools.append', function() {
  it('s3Tools.append', function(done) {
    let tools = s3Tools({ bucket: 'printawesome' })
    let promise = tools.append('another line', { key: 'test.txt' })
    log(promise)
    promise.should.eventually.be.fulfilled.notify(done)
  })
})

describe('s3Tools.put', function() {
  it('s3Tools.put', function(done) {
    let tools = s3Tools({ bucket: 'printawesome' })
    
    const stream = fs.createReadStream(
      path.join(
        __dirname, 'test.txt'
      )
    )
    
    let upload = tools.streamUpload(stream, {
      key: 'test.txt',
      tags: [{ Key: 'tag1', Value: 'value1' }]
    })
    setTimeout(upload.abort.bind(upload), 200);
    let promise = upload.promise()
    log(promise)
    promise.should.eventually.be.fulfilled.notify(done)
  })
})