const test = require('tape')
const utils = require('../utils')

test('getCompleter', t => {
  {
    const line = ''
    const actual = utils.getCompleter([])(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'no completions, empty line passed should return no completions')
  }
  {
    const line = '/'
    const actual = utils.getCompleter([])(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'no completions, "/" passed should return no completions')
  }
  {
    const line = 'a'
    const actual = utils.getCompleter([])(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'no completions, "a" passed should return no completions')
  }
  {
    const line = ''
    const actual = utils.getCompleter(['/help'])(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'available completions, empty line passed should return no completions')
  }
  {
    const line = '/'
    const actual = utils.getCompleter(['/help'])(line)
    const expected = [['/help'], line]
    t.deepEqual(actual, expected, 'available completion, / passed should return availabe match')
  }
  {
    const line = '/'
    const actual = utils.getCompleter(['/help', '/lol'])(line)
    const expected = [['/help', '/lol'], line]
    t.deepEqual(actual, expected, 'available completions, / passed should return availabe hits')
  }
  {
    const line = '/help'
    const actual = utils.getCompleter(['/help', '/help2'])(line)
    const expected = [['/help', '/help2'], line]
    t.deepEqual(actual, expected,
      `
      available completions with similar root, perfect match passed should return all hits
      if the perfect match is smaller than the other completion possible
      `)
  }
  {
    const line = '/help2'
    const actual = utils.getCompleter(['/help', '/help2'])(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'available completions, perfect match passed should return no hits')
    // this behaviour is to avoid showing the same command once is already completed
  }
  t.end()
})
