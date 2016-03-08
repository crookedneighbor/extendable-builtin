'use strict'

const OverExtend = require('../index')

class ExtendableError extends OverExtend(Error) {
  constructor (message) {
    super()

    this.message = message
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ExtendableError
