let tools = require('../src')({ bucket: 'printawesome' })

tools.upload(
  require('fs').createReadStream(require('path').join(__dirname, 'file.txt')), 
  { key: 'file.txt' }
).then(console.log)