const { expect } = require('chai')
const { stub, spy } = require('sinon')

const Siguex = require('./Siguex.js')

describe('Siguex', () => {
  const token = 'any token value'
  let siguex

  context('#prototype', () => {
    const methods = ['login']

    it('has method for each sigue operation', () =>
      expect(Object.keys(Siguex.prototype)).to.deep.equal(methods)
    )
  })

  context('#addMethod', () => {
    const proxy = stub()
      .withArgs(1, 2, 3, token)
      .returns('stubResult')

    const newMethodName = proxy.name

    beforeEach(() => {
      Siguex.addMethod(proxy)
      siguex = new Siguex(token, {})
    })
    afterEach(() => { Siguex.prototype[newMethodName] = null })

    it(`returns ${newMethodName} value passing token as last arguments`, () =>
      expect(siguex[newMethodName](1, 2, 3)).to.equal('stubResult')
    )
  })

  context('token handling', () => {
    const newToken = 'new token value'
    const setTokenSpy = spy()
    const clearTokenSpy = spy()

    beforeEach(() => {
      siguex = new Siguex(token, {
        setToken: setTokenSpy,
        clearToken: clearTokenSpy
      })
    })

    it('starts with token', () => { expect(siguex.token).to.equal(token) })

    describe('#setToken', () => {
      beforeEach(() => siguex.setToken(newToken))
      it('substitutes the token', () => expect(siguex.token).to.equal(newToken))

      it('calls the setToken as callback', () => expect(setTokenSpy.calledWithExactly(newToken)).to.equal(true))
    })

    describe('#setToken', () => {
      beforeEach(() => siguex.clearToken())

      it('clear the token', () => expect(siguex.token).to.equal(undefined))

      it('calls the clearToken as callback', () => expect(clearTokenSpy.called).to.equal(true))
    })
  })
})
