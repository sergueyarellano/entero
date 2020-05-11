const entero = require('..')

const cli = entero({
  prompt: '> ',
  onLine: (line) => {
    console.log(new Date().toLocaleTimeString(), '💬', line)
  },
  commands: {
    help: () => console.log('on my way! \n(っ▀¯▀)つ'),
    display: (...args) => console.log('args passed:', ...args),
    point: () => console.log('oh, what is the point?')
  },
  templates: {
    highlightnick: ({ nickname }) => `\x1b[36m${nickname}\x1b[0m`,
    encrypt: ({ msg }) => [].map.apply(msg, [(s) => s.charCodeAt()]).join('*')
  }
})

cli.log('highlightnick', { nickname: 'max estrella' })
cli.log('encrypt', { msg: 'secrets!' })

// Testing
// let count = 0
// setInterval(() => { console.log('count increased:', count++) }, 1000)
