const processArgs = (ARGS) => {
  let args = {}
  for (let i = 2; i < process.argv.length; i++) {
    for (let j = 0; j < ARGS.length; j++) {
      const { short, long, handler } = ARGS[j]
      if (process.argv[i] === `-${short}` || process.argv[i] === `--${long}`) {
        handler(args)
      }
    }
  }
  return args
}

module.exports = processArgs
