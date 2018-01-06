export const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1)

export const capKeys = (obj) : any => Object.keys(obj)
  .reduce((acc, key) => {
    acc[uppercase(key)] = obj[key]
    return acc;
  }, {})

export const createTagSet = (data) => {
  const tags = Object.keys(data).map(key => 
    `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`
  )
  
  return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`
}