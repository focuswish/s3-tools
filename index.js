const { PassThrough, Readable } = require('stream')
const AWS = require('aws-sdk')

const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1)

const createTagSet = (data) => {
  const tags = Object.keys(data).map(key => 
    `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`
  )
  return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`
}

const text = value => value.Body.toString('ascii')

module.exports = (
  config = { region: process.env.AWS_REGION }
) => {
  let { bucket, ...awsConfig } = config
  awsConfig.region = awsConfig.region || 'us-east-1'

  const s3 = new AWS.S3(awsConfig)

  const createParams = (params = {}) => {
    params = { ...params, bucket }
    return Object.keys(params)
      .reduce((acc, key) => {
        acc[uppercase(key)] = params[key]
        return acc;
      }, {})
  }

  const upload = (stream, params) => {
    let { tags, ...rest } = params
    let managedUpload
    const run = () => {
      let Body = new PassThrough() 
      AWS.config.update(awsConfig)
      managedUpload = new AWS.S3.ManagedUpload({
        tags,
        params: {
          Body,
          ...createParams(rest)
        }
      })   
      managedUpload.send()
      return Body
    }
    stream.pipe(run())
    return managedUpload
  }

  const streamObject = (params = {}) => { 
    let stream = s3.getObject(createParams(params)).createReadStream()
    return stream
  }

  const get = (params = {}) => {
    return s3.getObject(createParams(params)).promise()
  }

  const remove = (params = {}) => {
    return s3.deleteObject(createParams(params)).promise()
  }

  const copy = (params = {}) => {
    return s3.copyObject(createParams(params)).promise()
  }

  const wait = (state, params = {}) => {
    return s3.waitFor(state, createParams(params)).promise()
  }

  const append = async (text, params = {}) => {
    let { Body } = await get(params)
    let data = Body.toString('ascii')
    let stream = new Readable
    stream.push(data)
    stream.push((typeof text === 'string' ? text : text.join('\n')) + '\n')
    stream.push(null)
    return upload(stream, params)
  }

  return {
    upload,
    streamObject,
    append,
    get,
    remove,
    copy,
    wait,
    text
  }
}