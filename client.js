const entero = require('.')

entero({
  prompt: '>',
  prefix: () => new Date().toLocaleTimeString(),
  onLine: () => 'do something else'
})
