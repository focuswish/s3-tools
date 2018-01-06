const Adapter = require('./dist/lowdb/Adapter').default
const Source = require('./dist/s3Tools').default
const low = require('lowdb')

let adapter = new Adapter({bucket: 'stackerror', key: 'data.json'})

const log = (p) => p.then(d => console.log(d))

async function test() {
  const db = await low(adapter)
  let data = db.defaults({ posts: [], user: {} })
    .write()

  log(data)    
}


test()