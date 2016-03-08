'use strict'

const OverExtend = require('../index')
const inspect = require('util').inspect

class ExtendableArray extends OverExtend(Array) {
  constructor () {
    super()

    let elements = arguments
    if (arguments.length === 1 && typeof arguments[0] === 'number') {
      elements = new Array(arguments[0])
    }

    this.push.apply(this, elements)
  }

  inspect () {
    let stringArray = Array.from(this)
    return inspect(stringArray)
  }
}

module.exports = ExtendableArray
