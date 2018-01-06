import { PassThrough, Readable } from 'stream'
import * as AWS from 'aws-sdk';
import { capitalize, uppercase } from './helpers'
var concat = require('concat-stream')


Base.prototype.promisify = function(method) {
  return (params = {}) => {
    this.data = new Promise((resolve, reject) => {
      this.s3[method](
        capitalize({
          ...this.params,
          ...params
        }), (err, data) => {
        if(err) reject(err)
        else resolve(data)
      })
    })

    return this;
  } 
}

Base.prototype.text = function() {
  this.data = this.data.then(resp => 
    resp.Body.toString('ascii')
  )

  return this;
}

Base.prototype.append = function(text, args) {
  return this.promisify('getObject')(args).text().data
    .then(data => {
      let stream = new Readable
      stream.push(data)
      stream.push(
        typeof text === 'string' ? text += '\n' :
          text.join('\n')
      )
      stream.push(null)
      
      return this.streamUpload(
        stream, 
        args
      ).data
  })
}

Base.prototype.getSignedUrl = function (
  operation = 'getObject', 
  params = {}
) {
  
  return new Promise((resolve, reject) => {
    return this.s3.getSignedUrl(operation, 
      capitalize({
        ...this.params, 
        ...params
      }), 
      (err, data) => {
        if(err) reject(err)
        else resolve(data)
    })
  })
}

Base.prototype.streamUpload = function (stream, args) {
  let { tags, ...rest } = args;

  const run = (resolve, reject) => {
    const Body : any = new PassThrough()
    
    let params : any = {
      params: {
        Body,
        ...capitalize({
          ...this.params,
          ...rest
        })
      },
      tags: tags ? 
        tags : undefined
    }

    AWS.config.update(this.AwsConfig)
  
    let upload = new AWS.S3.ManagedUpload(params) 

    upload.send((err, data) => {
      if(err) reject(err)
      else resolve(data)
    })

    return Body;
  }

  this.data = new Promise((resolve, reject) => stream.pipe(
    run(resolve, reject))
  )

  return this;
}

Base.prototype.streamObject = function (params = {}) { 
  this.stream = this.s3.getObject(
    capitalize({
      ...this.params, 
      ...params
    })
  )
  .createReadStream()

  return this;
}

Base.prototype.createTagSet = function(data) {
  const tags = Object.keys(data).map(key => 
    `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`
  )

  return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`
}

Base.prototype.update = function (params = {}, AwsConfig = {}) {
  this.params = {
    ...this.params,
    params,
  }

  this.AwsConfig = {
    ...this.AwsConfig,
    AwsConfig
  }

  return this;
}

function Base (params = {}, AwsConfig = {}) {
  this.AwsConfig = {
    region: process.env.AWS_S3_BUCKET_REGION || 'us-east-1',
    ...AwsConfig
  }
  this.params = params;
  this.s3 = new AWS.S3(this.AwsConfig)
}

module.exports = (a, b) => new Base(a, b)

export default (a, b) => new Base(a, b)