const { build, serve } = require("./impl")
const { sleep } = require("../util")

build()

// @TODO do not sleep
sleep(20).then(() => {
  serve()
})
