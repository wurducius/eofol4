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

const getArgs = () => {
  let args = {}
  for (let i = 2; i < process.argv.length; i++) {
    for (let j = 0; j < CLI_ARGS.length; j++) {
      const { short, long, handler } = CLI_ARGS[j]
      if (process.argv[i] === `-${short}` || process.argv[i] === `--${long}`) {
        handler(args)
      }
    }
  }
  return args
}

module.exports = getArgs
