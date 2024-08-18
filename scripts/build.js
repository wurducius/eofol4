const { build, devParams } = require("./impl")

const analyze = process.argv[2] && (process.argv[2] === "--analyze" || process.argv[2] === "-a")

console.log("Eofol4 build")
build({ ...devParams, analyze }, false)
