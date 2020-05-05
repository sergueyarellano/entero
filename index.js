const readline = require('readline')
const stream = require('stream')

module.exports = entero

function entero ({ prompt = '>', onLine = line => console.log(line) }) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt
  })

  hijackConsole(rl)
  rl.prompt()
  rl.on('line', function (line) {
    const removePreviousLineHex = '\x1b[1A\x1b[K'
    process.stdout.write(removePreviousLineHex)
    onLine(line)
    rl.prompt()
  })
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
        next one is hack, it saves current prompt and content, forces the terminal
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

  return Buffer.from(`\n\x1b[1A\r\x1b[K${chunk.toString()}`, 'utf8')
}

// Testing
let count = 0
setInterval(() => { console.log('count increased:', count++) }, 1000)

/*
Position the Cursor: \x1b[<L>;<C>H or \x1b[<L>;<C>f (puts the cursor at line L and column C)
Move the cursor up N lines: \x1b[<N>A
Move the cursor down N lines: \x1b[<N>B
Move the cursor forward N columns: \x1b[<N>C
Move the cursor backward N columns: \x1b[<N>D
Clear the screen, move to (0,0): \x1b[2J
Erase to end of line: \x1b[K
Save cursor position: \x1b[s
Restore cursor position: \x1b[u

  opts:

  prefix: function or string
  rewritePrevious: true // if false,
*/
