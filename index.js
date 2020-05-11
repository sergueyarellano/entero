const readline = require('readline')
const stream = require('stream')
const { getCompleter } = require('./utils')

module.exports = entero

function entero ({ prompt = '>', onLine = line => console.log(line), commands = {}, templates = {} }) {
  const completions = Object.keys(commands).map(command => '/' + command)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt,
    completer: commands ? getCompleter(completions) : line => [[], line]
  })

  hijackConsole(rl)
  rl.prompt()
  rl.on('line', function (line) {
    const removePreviousLineHex = '\x1b[1A\x1b[K'
    process.stdout.write(removePreviousLineHex)
    if (line.startsWith('/')) {
      const words = line.match(/[^\s/]+/g)
      const type = words[0]
      const options = words.slice(1)
      const command = commands[type]
      typeof command === 'function' && command(...options)
    } else {
      line.length > 0 && onLine(line)
    }
    rl.prompt()
  })

  return {
    log: (templateName, payload) => {
      const defaultTemplate = () => `Did not find a template with the name "${templateName}"`
      const template = templates[templateName] || defaultTemplate
      const text = template(payload)
      console.log(text)
    },
    rl
  }
}

function hijackConsole (rl) {
  /*
    The idea is to intercept console use globally in the app.
    To do that, we will decorate the original streams stdout, stderr
    with new fresh writable streams. The way to do that is implementing
    the _write function for a writable stream as it says in the docs.
  */
  const [out, err] = [new stream.Writable(), new stream.Writable()].map(stream => {
    stream._write = function (chunk, _, next) {
      process.stdout.write(prependToPrompt(chunk, rl), _, () => {
        /*
        https://github.com/nodejs/node/blob/efec6811b667b6cf362d648bc599b667eebffce0/lib/readline.js#L376
        next one is a hack, it saves current prompt and content, forces the terminal
        to allocate a new line, and then writes the saved line. It seems to be tightly coupled to readline,
        We use it here because it comes in handy instead of having to reinvent the wheel
        */
        rl._refreshLine()
        next(null)
      })
    }
    return stream
  })

  // hijack console
  const myConsole = new console.Console(out, err)
  global.console = myConsole
}

function prependToPrompt (chunk, rl) {
  const line = chunk.toString()
  // If line is longer than the width of the terminal x times we have to go up x times
  const offset = Math.ceil(line.length / process.stdout.columns)

  /*
    the idea is logging whatever that comes from the use of console.log,
    but in a way that we always put the current prompt at the end

    For that we can use ansi escapes and ascii control codes:
    https://en.wikipedia.org/wiki/C0_and_C1_control_codes
    https://en.wikipedia.org/wiki/ANSI_escape_code
    https://notes.burke.libbey.me/ansi-escape-codes/ <- this is very good

    the sequence consists on:
    \n - new line, so the prompt is copied twice

    \x1b[1A - move cursor up 1 line
    \r - move cursor to start of line
    \x1b[K or \x1b[0J - will erase the line
  */

  return Buffer.from(`\n\x1b[${offset}A\r\x1b[K${line}`, 'utf8')
}
