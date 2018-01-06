## Examples

```js

let s3Tools = require('s3-tools')
let tools = s3Tools(
  { bucket: 'my-bucked', key: 'my-key' }, // params
  { region: 'us-east-1', } // AwsConfig
)

tools.getSignedUrl('getObject', { expires: 60 }).then(resp => console.log(resp))

```


```js

let fs = require('fs')
let path = require('path')
let tools = require('s3-tools')

let stream = fs.createReadStream(path.join(__dirname, 'some-document.txt'))

tools().streamUpload(stream, {
  bucket: 'printawesome', 
  key: 'lorem3/test.txt',
  tags: [{Key: 'tag1', Value: 'value1'}, {Key: 'tag2', Value: 'value2'}]
})
  .then(result => console.log(result))
  .catch(err => console.log(err))

```