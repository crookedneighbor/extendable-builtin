// Adapted from https://phabricator.babeljs.io/T3083
module.exports = function OverExtend (builtin) {
  function ExtendableBuiltin () {
    builtin.apply(this, arguments)
  }
  ExtendableBuiltin.prototype = Object.create(builtin.prototype)
  Object.setPrototypeOf(ExtendableBuiltin, builtin)

  return ExtendableBuiltin
}
