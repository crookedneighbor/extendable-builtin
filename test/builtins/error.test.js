'use strict'

const ExtendableError = require('../../builtins/error')

describe('ExtendableError', function () {
  beforeEach(function () {
    this.error = new ExtendableError()
  })

  it('is an instance of Error', function () {
    expect(this.error).to.be.an.instanceOf(Error)
  })

  it('can be configured with a message', function () {
    let errorWithMessage = new ExtendableError('message')

    expect(errorWithMessage.message).to.exist
  })

  it('has a stacktrace', function () {
    expect(this.error.stack).to.exist
  })

  it('has a name property', function () {
    expect(this.error.name).to.eql('ExtendableError')
  })

  it('automatically names errors extending it with their own name', () => {
    class CustomError extends ExtendableError {
    }

    let customErr = new CustomError()

    expect(customErr.name).to.eql('CustomError')
  })

  it('is subclassaable', function () {
    class SubclassedError extends ExtendableError { }
    let customError = new SubclassedError('a message')

    expect(customError.message).to.eql('a message')
  })

  it('automatically names error after subclass', function () {
    class SubclassedError extends ExtendableError { }
    let customError = new SubclassedError('a message')

    expect(customError.name).to.eql('SubclassedError')
  })

  it('allows subclasses to have own methods', function () {
    class SubclassedError extends ExtendableError {
      getStack () {
        return this.stack
      }
    }

    let customError = new SubclassedError('a message')

    expect(customError.getStack()).to.include('at Context')
    expect(customError.getStack()).to.include('at Runner.runTest')
  })

  it('includes stack trace when thrown', function () {
    class SubclassedError extends ExtendableError { }
    let customError = new SubclassedError('a message')

    try {
      throw customError
    } catch (e) {
      expect(e.stack).to.exist
      expect(e.stack).to.include('at Context')
      expect(e.stack).to.include('at Runner.runTest')
    }
  })

  it('allows for setting a default message', function () {
    class SubclassedError extends ExtendableError {
      constructor (message) {
        super(message)

        this.message = message || 'sub class default message'
      }
    }

    let errorWithDefaultMessage = new SubclassedError()
    let errorWithMessage = new SubclassedError('custom message')

    expect(errorWithDefaultMessage.message).to.eql('sub class default message')
    expect(errorWithMessage.message).to.eql('custom message')
  })
})
