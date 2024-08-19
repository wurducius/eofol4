const https = require("https")

const baseUrl = "https://eofol.com/eofol4/"

const lighthouseUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${baseUrl}&strategy=mobile`

const cateogies = ["performance"]

const log = (msg) => console.log(msg)
const logError = (msg) => log(`ERROR: ${msg}`)

const parseCategory = (result) => (category) => {
  const data = result[category]
  const title = data.title
  const resultScore = Number(data.score * 100)
  return { title, score: resultScore }
}

// ======================================================

const testLighthouse = (callback) => {
  let data = ""

  https.get(lighthouseUrl, (res) => {
    res.on("data", (chunk) => {
      data += chunk
    })

    res.on("end", () => {
      const json = JSON.parse(data)
      const result = json.lighthouseResult.categories

      const parse = parseCategory(result)
      cateogies.forEach((c) => {
        const resultScore = parse(c)
        callback(resultScore)
      })
    })

    res.on("error", (err) => {
      logError(err.message)
    })
  })
}

module.exports = testLighthouse
