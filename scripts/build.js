const { build } = require("./impl")

const analyze = process.argv[2] && process.argv[2] === "--analyze"

build({ mode: "production", analyze }, false)
