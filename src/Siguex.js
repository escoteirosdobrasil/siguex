const login = require('./login')

class Siguex {
  constructor (token, { setToken, clearToken }) {
    this.token = token
    this.setTokenCallback = setToken
    this.clearTokenCallback = clearToken
  }

  setToken (token) {
    this.token = token
    this.setTokenCallback(token)
  }

  clearToken () {
    delete this.token
    this.clearTokenCallback()
  }
}

Siguex.addMethod = function addMethod (method) {
  Siguex.prototype[method.name] = function () {
    return method.apply(this, Array.from(arguments).concat(this.token))
  }
}

const importedMethods = [login]

importedMethods.forEach(Siguex.addMethod)

module.exports = Siguex
