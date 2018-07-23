export default function merge (obj) {
  for (let i = 1; i < arguments.length; i++) {
    const target = arguments[i]
    for (let key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key]
      }
    }
  }

  return obj
}
