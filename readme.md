## Examples

[![Greenkeeper badge](https://badges.greenkeeper.io/focuswish/s3-tools.svg)](https://greenkeeper.io/)

```js

const tools = require('s3-tools')({
  region: 'us-east-1',
  bucket: 'some-bucket', 
  key: 'some-key'
})

tools.getSignedUrl('getObject', { expires: 60 }).then(resp => console.log(resp))

```


```js

const fs = require('fs')
const path = require('path')
const tools = require('s3-tools')

const stream = fs.createReadStream(path.join(__dirname, 'some-document.txt'))
const s3 = tools({
  region: 'us-east-1',
  bucket: 'printawesome', 
  key: 'lorem3/test.txt',
  tags: [{Key: 'tag1', Value: 'value1'}, {Key: 'tag2', Value: 'value2'}]
})

var promise = new Promise((resolve, reject) => {
  stream.pipe(s3.streamUpload()(resolve, reject))
})

promise
  .then(result => console.log(result))
  .catch(err => console.log(err))

```