const processArgs = require("../util/args")

const CLI_ARGS = [
  {
    short: "a",
    long: "analyze",
    handler: (args) => {
      args.ANALYZE = true
    },
  },
  {
    short: "p",
    long: "prod",
    handler: (args) => {
      args.MODE = "production"
    },
  },
]

const getArgs = () => processArgs(CLI_ARGS)

module.exports = getArgs
