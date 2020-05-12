module.exports = {
  getCompleter
}

function getCompleter (getCompletions) {
  return (line) => {
    if (!line.length) return [[], line]

    const re = /(?:.*)?([/.@#][^\s]*)/
    const lineMatch = line.match(re)
    const possibleHit = lineMatch && lineMatch[1]

    const hits = getCompletions().filter((c) => c.startsWith(possibleHit))
    const isPerfectMatch = hits[0] === possibleHit

    if (hits.length === 1 && isPerfectMatch) return [[], line]
    if (hits.length === 1) {
      const hitPosition = line.indexOf(possibleHit)
      const subs = line.substring(0, hitPosition)
      const composedHit = subs + hits[0]
      return [[composedHit], line]
    }

    return [hits, line]
  }
}
