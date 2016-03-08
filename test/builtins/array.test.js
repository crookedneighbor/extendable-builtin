'use strict'

const ExtendableArray = require('../../builtins/array')
const stdoutTrap = require('logtrap').stdoutTrap

describe('ExtendableArray', function () {
  beforeEach(function () {
    this.array = new ExtendableArray('a', 'b', 'c')
  })

  it('is an instance of Array', function () {
    expect(this.array).to.be.an.instanceOf(Array)
  })

  it('accepts arguments to create an array-like object', function () {
    expect(this.array[0]).to.eql('a')
    expect(this.array[1]).to.eql('b')
  })

  it('creates an empty array of certain length if single number argument is passed in', function () {
    let arrayWithUndefinedValues = new ExtendableArray(3)

    expect(arrayWithUndefinedValues).to.have.a.lengthOf(3)
    expect(arrayWithUndefinedValues[0]).to.eql(undefined)
    expect(arrayWithUndefinedValues[1]).to.eql(undefined)
    expect(arrayWithUndefinedValues[2]).to.eql(undefined)
  })

  it('creates an array of number values if more than one number is passed in', function () {
    let arrayWithUndefinedValues = new ExtendableArray(3, 2)

    expect(arrayWithUndefinedValues).to.have.a.lengthOf(2)
    expect(arrayWithUndefinedValues[0]).to.eql(3)
    expect(arrayWithUndefinedValues[1]).to.eql(2)
  })

  it('formats console.log in an array-like way', function () {
    let stringifiedArray = stdoutTrap(() => {
      console.log(this.array)
    })

    expect(stringifiedArray).to.equal(`[ 'a', 'b', 'c' ]\n`)
  })

  it('formats console.log in an array-like way with complex elements', function () {
    let complexArray = new ExtendableArray('a', { foo: 'bar', foo2: { bar2: ['1', '2'] } }, [1, 2, 3])
    let stringifiedArray = stdoutTrap(() => {
      console.log(complexArray)
    })

    expect(stringifiedArray).to.equal(`[ 'a', { foo: 'bar', foo2: { bar2: [Object] } }, [ 1, 2, 3 ] ]\n`)
  })

  it('is subclassaable', function () {
    class SubclassedArray extends ExtendableArray { }

    let subclassedArray = new SubclassedArray('a', 'b', 'c')
    subclassedArray.push('d')

    expect(subclassedArray[0]).to.eql('a')
    expect(subclassedArray[1]).to.eql('b')
    expect(subclassedArray[2]).to.eql('c')
    expect(subclassedArray[3]).to.eql('d')
    expect(subclassedArray).to.have.a.lengthOf(4)
  })

  it('allows subclasses to have own methods', function () {
    class SubclassedArray extends ExtendableArray {
      getFirst () {
        return this[0]
      }
    }

    let subclassedArray = new SubclassedArray('a', 'b', 'c')

    expect(subclassedArray.getFirst()).to.eql('a')
  })
})
