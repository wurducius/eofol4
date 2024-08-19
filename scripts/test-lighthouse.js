const testLighthouse = require("./impl/test-lighthouse")
const { prettyTime, success, error, primary } = require("../util")

const TEST_LIGHTHOUSE_PASS_COUNT_DEFAULT = 5
let TEST_LIGHTHOUSE_PASS_COUNT = TEST_LIGHTHOUSE_PASS_COUNT_DEFAULT

const newline = () => console.log("")
const log = (msg) => console.log(primary(`Eofol4 Lighthouse test ${msg}`))
const logResultSuccess = (msg) => console.log(success(msg))
const logResultFail = (msg) => console.log(error(msg))

const timeStart = new Date()

if (process.argv.length >= 3 && process.argv[2] !== undefined) {
  const numberArg = Number(process.argv[2])
  if (Number.isInteger(numberArg) && numberArg >= 0) {
    TEST_LIGHTHOUSE_PASS_COUNT = numberArg
  }
}

log(`starting with ${TEST_LIGHTHOUSE_PASS_COUNT} passes...`)
newline()

const result = Array.from({ length: TEST_LIGHTHOUSE_PASS_COUNT })

for (let i = 0; i < TEST_LIGHTHOUSE_PASS_COUNT; i++) {
  testLighthouse((res) => {
    result[i] = res
    const resultScore = res.score
    const title = res.title
    const score = `${resultScore.toFixed(0)}%`
    const resultDisplay = `Test attempt (${i + 1}/${TEST_LIGHTHOUSE_PASS_COUNT}) -> ${title}: ${score}`
    if (resultScore < 1) {
      logResultFail(resultDisplay)
    } else {
      logResultSuccess(resultDisplay)
    }
    if (result.filter(Boolean).length === TEST_LIGHTHOUSE_PASS_COUNT) {
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
    }
  })
}
