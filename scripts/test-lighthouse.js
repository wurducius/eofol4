const { testLighthouse } = require("./impl")
const { prettyTime, success, error, primary } = require("../util")

const baseUrl = "https://eofol.com/eofol4/"
const lighthouseUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${baseUrl}&strategy=mobile`
const cateogies = ["performance"]

const TEST_LIGHTHOUSE_PASS_COUNT_DEFAULT = 5
let TEST_LIGHTHOUSE_PASS_COUNT = TEST_LIGHTHOUSE_PASS_COUNT_DEFAULT

const TEST_LIGHTHOUSE_WAIT_INTERVAL_MS_DEFAULT = 1000
let TEST_LIGHTHOUSE_WAIT_INTERVAL_MS = TEST_LIGHTHOUSE_WAIT_INTERVAL_MS_DEFAULT

const newline = () => console.log("")
const log = (msg) => console.log(primary(`Eofol4 Lighthouse test ${msg}`))
const logResultSuccess = (msg) => console.log(success(msg))
const logResultFail = (msg) => console.log(error(msg))

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const timeStart = new Date()

if (process.argv.length >= 3 && process.argv[2] !== undefined) {
  const numberArg = Number(process.argv[2])
  if (Number.isInteger(numberArg) && numberArg >= 0) {
    TEST_LIGHTHOUSE_PASS_COUNT = numberArg
  }
}

if (process.argv.length >= 4 && process.argv[3] !== undefined) {
  const numberArg = Number(process.argv[3])
  if (Number.isInteger(numberArg) && numberArg >= 0) {
    TEST_LIGHTHOUSE_WAIT_INTERVAL_MS = numberArg
  }
}

log(`starting with ${TEST_LIGHTHOUSE_PASS_COUNT} passes with wait interval ${TEST_LIGHTHOUSE_WAIT_INTERVAL_MS}...`)
newline()

const result = Array.from({ length: TEST_LIGHTHOUSE_PASS_COUNT })

const promises = Array.from({ length: TEST_LIGHTHOUSE_PASS_COUNT })

const test = async (lighthouseUrl, cateogies, i) =>
  await testLighthouse(lighthouseUrl, cateogies).then((res) => {
    result[i] = res
    const resultScore = res.score
    const title = res.title
    const score = `${resultScore.toFixed(1)}%`
    const resultDisplay = `Test pass [${i + 1}/${TEST_LIGHTHOUSE_PASS_COUNT}] -> ${title}: ${score}`
    if (resultScore < 100) {
      logResultFail(resultDisplay)
    } else {
      logResultSuccess(resultDisplay)
    }
    return res
  })

const run = async () => {
  for (let i = 0; i < TEST_LIGHTHOUSE_PASS_COUNT; i++) {
    promises[i] = await test(lighthouseUrl, cateogies, i).then(async (res) => {
      if (i !== 0 && i % 5 === 0) {
        return await sleep(TEST_LIGHTHOUSE_WAIT_INTERVAL_MS).then(() => res)
      } else {
        return res
      }
    })
  }
}

run().then(() => {
  Promise.all(promises).then(() => {
    const averageScore = Number(
      result.map((x) => x.score).reduce((acc, next) => acc + next / TEST_LIGHTHOUSE_PASS_COUNT, 0),
    ).toFixed(1)
    const average = `${averageScore}%`
    const averageDisplay = `Average -> ${average}`
    newline()
    if (averageScore < 100) {
      logResultFail(averageDisplay)
      newline()
      logResultFail("LIGHTHOUSE TEST FAILED")
    } else {
      logResultSuccess(averageDisplay)
      newline()
      logResultSuccess("LIGHTHOUSE TEST PASSED")
    }
    newline()
    log(
      `took ${prettyTime(new Date() - timeStart)
        .split("")
        .map((letter) => letter.toLowerCase())
        .join("")}.`,
    )
    log("finished.")
  })
})
