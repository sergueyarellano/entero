module.exports = {
  getCompleter
}

function getCompleter (getCompletions) {
  return (line) => {
    const hits = line.length ? getCompletions().filter((c) => c.startsWith(line)) : []
    const isPerfectMatch = hits.length === 1 && getCompletions().some(c => c === line.match(/^[/.@#][^\s]*/)[0])

    return [hits.length && !isPerfectMatch ? hits : [], line]
  }
}
