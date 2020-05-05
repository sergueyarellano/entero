module.exports = {
  getCompleter
}

function getCompleter (completions) {
  return (line) => {
    const hits = line.length ? completions.filter((c) => c.startsWith(line)) : []
    const isPerfectMatch = hits.length === 1 && completions.some(c => c === line.match(/\/[^\s]*/)[0])

    return [hits.length && !isPerfectMatch ? hits : [], line]
  }
}
