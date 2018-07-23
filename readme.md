## Examples

```js

let fs = require('fs')
let path = require('path')
let tools = require('s3-tools')

let stream = fs.createReadStream(path.join(__dirname, 'some-document.txt'))

tools = tools({ bucket: 'printawesome' })

tools.streamUpload(stream, {
  key: 'test.txt',
  tags: [{
    Key: 'tag1', Value: 'value1'
  }]
})
  .then(result => console.log(result))
  .catch(err => console.log(err))

```