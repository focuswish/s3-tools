import { PassThrough, Readable } from 'stream'
import { capKeys, createTagSet } from './helpers'
import Base from './Base'
import * as AWS from 'aws-sdk';

class Tools extends Base {
  promisify (method) {
    return (params = {}) => {
      this.data = new Promise((resolve, reject) => {
        this.s3[method](
          capKeys({
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

  value () {
    return this.data
  }

  text = async () => {
    let value = await this.value()
    return value.Body.toString('ascii')
  }

  append = async (text, args = {}) => {
    let data = await this.promisify('getObject')(args).text();
    let stream = new Readable
    stream.push(data)
    stream.push((typeof text === 'string' ? text : text.join('\n')) + '\n')
    stream.push(null)
    return this.streamUpload(stream, args)
  }

  getSignedUrl (
    operation = 'getObject', 
    params = {}
  ) {
    return new Promise((resolve, reject) => {
      return this.s3.getSignedUrl(operation, 
        capKeys({
          ...this.params, 
          ...params
        }), (err, data) => {
          if(err) reject(err)
          else resolve(data)
      })
    })
  }

  streamUpload (stream, { tags = undefined, ...rest } = {}) {  
    const run = (resolve, reject) => {
      let Body : any = new PassThrough() 
  
      AWS.config.update(this.AwsConfig)
      let upload = new AWS.S3.ManagedUpload({
        tags,
        params: {
          Body,
          ...capKeys({
            ...this.params,
            ...rest
          })
        }
      })   
      upload.send((err, data) => {
        if(err) reject(err)
        else resolve(data)
      })
  
      return Body;
    }
  
    return new Promise((resolve, reject) => stream.pipe(
      run(resolve, reject))
    )
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

module.exports = Tools;
export default Tools;