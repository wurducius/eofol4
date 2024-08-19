const getArgs = () => {
  const args = {}

  if (process.argv.length >= 3 && process.argv[2] === "--prod") {
    args.MODE = "production"
  }

  return args
}

module.exports = getArgs
