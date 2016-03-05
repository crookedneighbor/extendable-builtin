# Over Extend

## Installation

```bash
npm i -S over-extend
```

## Why?
In Babel 5, you could easilly extend built-ins like `Error`, `Array`, `String`, etc like this:

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

## Credits

This was largely adapted from https://phabricator.babeljs.io/T3083

## Testing

```bash
npm t
```
