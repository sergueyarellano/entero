const test = require('tape')
const utils = require('../utils')

test('getCompleter', t => {
  {
    const getCompletions = () => []
    const line = ''
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'no completions, empty line passed should return no completions')
  }
  {
    const getCompletions = () => []
    const line = '/'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'no completions, "/" passed should return no completions')
  }
  {
    const getCompletions = () => []
    const line = 'a'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'no completions, "a" passed should return no completions')
  }
  {
    const getCompletions = () => ['/help']
    const line = ''
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'available completions, empty line passed should return no completions')
  }
  {
    const getCompletions = () => ['/help']
    const line = '/'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['/help'], line]
    t.deepEqual(actual, expected, 'available completion, / passed should return availabe match')
  }
  {
    const getCompletions = () => ['/help', '/lol']
    const line = '/'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['/help', '/lol'], line]
    t.deepEqual(actual, expected, 'available completions, / passed should return availabe hits')
  }
  {
    const getCompletions = () => ['/help', '/help2']
    const line = '/help'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['/help', '/help2'], line]
    t.deepEqual(actual, expected,
      `
      available completions with similar root, perfect match passed should return all hits
      if the perfect match is smaller than the other completion possible
      `)
  }
  {
    const getCompletions = () => ['/help', '/help2']
    const line = '/help2'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [[], line]
    t.deepEqual(actual, expected, 'available completions, perfect match passed should return no hits')
    // this behaviour is to avoid showing the same command once is already completed
  }
  {
    const getCompletions = () => ['/help', '.help2']
    const line = '.h'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['.help2'], line]
    t.deepEqual(actual, expected, 'completions with different syntax, "." should return its hit')
    // this behaviour is to avoid showing the same command once is already completed
  }
  {
    const getCompletions = () => ['/help', '.help2', '@help3']
    const line = '@h'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['@help3'], line]
    t.deepEqual(actual, expected, 'completions with different syntax, "@" should return its hit')
    // this behaviour is to avoid showing the same command once is already completed
  }
  {
    const getCompletions = () => ['/help', '.help2', '#help3']
    const line = '#h'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['#help3'], line]
    t.deepEqual(actual, expected, 'completions with different syntax, "#" should return its hit')
    // this behaviour is to avoid showing the same command once is already completed
  }
  {
    const getCompletions = () => ['/help', '.help2', '#help3']
    const line = 'hey buddy #h'
    const actual = utils.getCompleter(getCompletions)(line)
    const expected = [['hey buddy #help3'], line]
    t.deepEqual(actual, expected, 'completions with different syntax, "#" not at the beggining should return its hit with line replace at the end')
    // this behaviour is to avoid showing the same command once is already completed
  }
  t.end()
})
