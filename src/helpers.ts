export const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1)

export const capitalize = (obj) : any => Object.keys(obj)
  .reduce((acc, key) => {
    acc[uppercase(key)] = obj[key]
    return acc;
  }, {})