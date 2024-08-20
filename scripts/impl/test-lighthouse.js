const parseCategory = (result) => (category) => {
  const data = result[category]
  const title = data.title
  const resultScore = Number(data.score * 100)
  return { title, score: resultScore }
}

const testLighthouse = async (lighthouseUrl, cateogries) =>
  await fetch(lighthouseUrl)
    .then((res) => res.json())
    .then((json) => {
      const result = json.lighthouseResult.categories
      const parse = parseCategory(result)
      return cateogries.map((c) => parse(c))[0]
    })

module.exports = testLighthouse
