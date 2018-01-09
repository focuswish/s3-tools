## Examples

```js

let { tools } = require('s3-tools')
let tools = tools(
  { bucket: 'my-bucked', key: 'my-key' }, // params
  { region: 'us-east-1', } // AwsConfig
)

tools.getSignedUrl('getObject', { expires: 60 }).then(resp => console.log(resp))

```


```js

let fs = require('fs')
let path = require('path')
let { tools } = require('s3-tools')

let stream = fs.createReadStream(path.join(__dirname, 'some-document.txt'))

tools = tools({ bucket: 'printawesome' }, { region: 'us-east-1' })

tools.streamUpload(stream, {
  key: 'lorem3/test.txt',
  tags: [{Key: 'tag1', Value: 'value1'}, {Key: 'tag2', Value: 'value2'}]
})
  .then(result => console.log(result))
  .catch(err => console.log(err))

```