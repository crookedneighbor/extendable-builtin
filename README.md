# Over Extend

## Installation

```bash
npm i -S over-extend
```

## Why?
In Babel 5, you could easilly extend built-ins like `Error` and `Array` like this:

```js
class CustomArray extends Array {
  constructor () {
    super()

    this.name = this.constructor.name
  }

  getFirst () {
    return this[0]
  }
}

let customArray = new CustomArray()
customArray.push('a')
customArray.push('b')
customArray.push('c')

console.log(customArray.name) // 'CustomArray'
console.log(customArray instanceof CustomArray) // true
console.log(customArray.getFirst()) // 'a'
```

However, in Babel 6, it doesn't respect the new class and instead treats it like it's the built-in:

```js
console.log(customArray.name) // 'Array'
console.log(customArray instanceof CustomArray) // false
console.log(customArray instanceof Array) // true
console.log(customArray.getFirst()) // throws a method undefined error
```

This module helps regain that behavior.

## Example

Here's an example for how to create custom `Error` classes:

```js
const OverExtend = require('over-extend')

class HttpError extends OverExtend(Error) {
  constructor () {
    super()

    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  getMessage () {
    return this.message
  }
}

class NotFoundError extends HttpError {
  constructor (message) {
    super()

    this.statusCode = 404
    this.message = message || 'Not Found'
  }
}

let userNotFoundError = new NotFoundError('User with that id not found')
console.log(userNotFoundError.name) // 'NotFoundError'
console.log(userNotFoundError.statusCode) // 404
```

## Ready Made Extendables

If you're running Node >= v4, you can use some pre-configured extendable classes. 

**Note:** If you're using Babel 6, you cannot use these readymade examples with the `transform-es2015-classes` plugin (included in the `es-2015` preset) or you will recieve `TypeError: Class constructors cannot be invoked without 'new'`. To migitgate this, you can install only the plugins that provide functionality that Node v4 does not already provide:

```json
{
  "plugins": [
    "check-es2015-constants",
    "transform-es2015-for-of",
    "transform-es2015-arrow-functions",
    "transform-es2015-parameters",
    "transform-es2015-spread",
    "transform-es2015-destructuring",
    "transform-es2015-modules-commonjs",
    "transform-regenerator"
  ]
}
```

If you're using npm 3, you can simply install the `es-2105` preset and specify the plugins in your `.babelrc`.

### Error

As illustrated in the example error above, in order to get the stack trace of the error, you need to call `Error.captureStackTrace`. The ExtendableError class in this module does all that magic for you. Check out [the source code](builtins/error.js) for the implimentation.

```js
const ExtendableError = require('over-extend/builtins/error')

class ValidationError extends ExtendableError {
  constructor(config) {
    super()
    config = config || {}
    this.message = config.message || 'validation error detected'
    this.errors = config.errors || {}
  }

  getStackTrace () {
    return this.stack
  }

  prettyPrintErrors () {
    let message = 'Errors -'
    
    Object.keys(this.errors).sort().forEach((err) => {
      let error = this.errors[err]
      message += `\n${error.label}: ${error.message},`
    })

    // Cut off trailing comma
    message = message.substring(0, message.length - 1)

    return message
  }
}

//------------------------------

let error = new ValidationError({
  errors: {
    email: {
      label: 'Email',
      message: 'Email not formatted correctly'
    },
    abc: {
      label: 'ABC',
      message: 'You do not know your abcs'
    }
  }
})

// Errors -
// ABC: You do not know your abcs,
// Email: Email not formatted correctly
error.prettyPrintErrors()
```

### Array

If you extend the `Array` class on your own, you'll have to do extra work in the constructor to make it behave like a normal array when instantiating. 

When using `ExendableArray`, it's recomended that you do not include a constructor in subclass or it may not instantiate correctly. See [the source code](builtins/array.js) for more details.

```js
const ExtendableArray = require('over-extend/builtins/array')

class MyArray extends ExtendableArray {
  getFirst () {
    return this[0]
  }

  getLast () {
    return this[this.length - 1]
  }

  reverseEachElement () {
    for (var i = 0; i < this.length; i++) {
      let element = this[i]
      let reversedElement = element.split('').reverse().join('')

      this[i] = reversedElement
    }
  }
}

//------------------------------

let array = new MyArray('abc', '123')

array.reverseEachElement()

array // [ 'cba', '321' ]
array.getFirst() // 'cba'
array.getLast() // '321'
```

## Credits

This was largely adapted from https://phabricator.babeljs.io/T3083

## Testing

The builtins tests require Node v4 or higher.

```bash
npm t
```
