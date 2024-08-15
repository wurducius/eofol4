const { minify } = require("compiler/scripts/minify-js")

const uglifyOptions = {
  parse: {},
  compress: true,
  mangle: true,
  output: {
    semicolons: false,
  },
}

const minifyJs = (content) => minify(content, uglifyOptions).code

module.exports = minifyJs
