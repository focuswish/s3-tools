import { PassThrough, Readable } from 'stream'
import { capKeys, createTagSet } from './helpers'
import Base from './Base'
import * as AWS from 'aws-sdk';

class Tools extends Base {
  promisify (method) {
    return (...args) => {
      if(!args.length) args.push({})

      args[args.length - 1] = capKeys({
        ...this.params,
        ...args[args.length - 1]
      })
      
      let promise = new Promise((...promise) => {
        args.push((err, data) => {
          if(err) promise[1](err)
          else promise[0](data)
        })
      })

      this.s3[method](...args)
      this.promise = () => promise;
      
      return this;
    } 
  }

  value = () => this.promise()

  text = () => this.promise()
    .then(value => value.Body.toString('ascii'))
  

  append = async (text, args = {}) => {
    let data = await this.get(args).text()
    let stream = new Readable
    stream.push(data)
    stream.push((typeof text === 'string' ? text : text.join('\n')) + '\n')
    stream.push(null)
    this.streamUpload(stream, args)
    return this.upload.promise()
  }

  get = (...args) => this.promisify('getObject')(...args)
  remove = (...args) => this.promisify('deleteObject')(...args)
  getSignedUrl = (...args) => this.promisify('getSignedUrl')(...args)
  copy = (...args) => this.promisify('copyObject')(...args)
  wait = (...args) => this.promisify('waitFor')(...args)

  streamUpload (stream, { tags = undefined, ...rest } = {}) {  
    const run = () => {
      let Body : any = new PassThrough() 
  
      AWS.config.update(this.AwsConfig)
      this.upload = new AWS.S3.ManagedUpload({
        tags,
        params: {
          Body,
          ...capKeys({
            ...this.params,
            ...rest
          })
        }
      })   
      this.upload.send()
  
      return Body;
    }

    stream.pipe(run())

    return this.upload;
  }

  streamObject (params = {}) { 
    this.stream = this.s3.getObject(
      capKeys({
        ...this.params, 
        ...params
      })
    )
    .createReadStream()
  
    return this;
  }

  createTagSet = (data) => createTagSet(data)

  update (params = {}, AwsConfig = {}) {
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
}

export default Tools;
exports.Tools = Tools;