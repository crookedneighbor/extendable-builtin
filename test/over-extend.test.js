const OverExtend = require('../index')

describe('OverExtend', function () {
  beforeEach(function () {
    class ExtendableError extends OverExtend(Error) {
      constructor () {
        super()

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
      }

      getMessage () {
        return this.message
      }
    }

    class MyCustomError extends ExtendableError {
      constructor (message) {
        super()

        this.message = message || 'default error message'
      }
    }

    this.MyCustomError = MyCustomError
    this.customError = new MyCustomError()
  })

  it('lets instances inherit properties from their own constructor', function () {
    expect(this.customError.name).to.eql('MyCustomError')
  })

  it('makes instances an instance behave as an intance of the custom class', function () {
    expect(this.customError).to.be.an.instanceOf(this.MyCustomError)
  })

  it('allows you to add methods to the class', function () {
    expect(this.customError.getMessage()).to.eql('default error message')
  })
})

describe('Native Babel 6 Behavior', function () {
  beforeEach(function () {
    class ExtendableError extends Error {
      constructor () {
        super()

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
      }

      getMessage () {
        return this.message
      }
    }

    class MyCustomError extends ExtendableError {
      constructor (message) {
        super()

        this.property = 'MyCustomProperty'
        this.message = message || 'default error message'
      }
    }

    this.MyCustomError = MyCustomError
    this.customError = new MyCustomError()
  })

  it('does not let instances inherit properties from their own constructor', function () {
    expect(this.customError.name).to.not.eql('MyCustomError')
    expect(this.customError.name).to.eql('Error')
  })

  it('does not make instances an instance behave as an intance of the custom class', function () {
    expect(this.customError).to.not.be.an.instanceOf(this.MyCustomError)
    expect(this.customError).to.be.an.instanceOf(Error)
  })

  it('does not allow you to declare methods on the custom class', function () {
    expect(() => {
      this.customError.getMessage()
    }).to.throw(Error)
  })
})
