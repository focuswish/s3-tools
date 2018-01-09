import * as AWS from 'aws-sdk';

interface Base {
  AwsConfig: any,
  params: any,
  s3: any,
  data: any,
  stream: any,
  region: any,
  upload: any,
  promise: any
}

class Base {
  constructor(
    params = {}, 
    AwsConfig = {}
  ) {
    this.AwsConfig = {
      region: 'us-east-1',
      ...AwsConfig
    }
    
    this.params = params;
    this.s3 = new AWS.S3(this.AwsConfig)
  }
}


export default Base
exports.Base = Base;