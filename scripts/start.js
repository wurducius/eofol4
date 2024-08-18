const { build, serve } = require("./impl")
const { sleep } = require("../util")

build()

// @TODO do not sleep instead fix async promise handling in build
sleep(20).then(() => {
  serve()
})
