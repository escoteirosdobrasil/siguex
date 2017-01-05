const { expect } = require('chai')
const sinon = require('sinon')

const login = require('./login')

describe('login', () => {
  const dependencies = {}
  const successResponse = '{ success:true }'
  const nonSuccessResponse = '{ success:false, message: \'test\' }'
  const username = 'any username'
  const password = 'any password'
  const token = '51D116905149BB1329748FA4EA68CBB9'

  const prepareMocks = (response) => {
    Object.assign(dependencies, {
      http: {
        post: sinon.stub()
          .withArgs('http://sigue.escoteiros.org.br/sigue/loginSigue.do', 'parseQueryString')
          .returns(Promise.resolve({
            data: response,
            headers: {
              'set-cookie': [`JSESSIONID=${token}; Path=/sigue/; HttpOnly`]
            }
          }))
      },
      queryString: {
        stringify: sinon.stub()
          .withArgs({ dsLogin: username, dsSenha: password })
          .returns('parseQueryString')
      }
    })
  }

  it('calls login on sigue parsing as json', () => {
    prepareMocks(nonSuccessResponse)
    return login(username, password, null, dependencies).then(result => {
      expect(result.success).to.equal(false)
      expect(result.token).to.equal(undefined)
    })
  })

  it('returns the token when login works', () => {
    prepareMocks(successResponse)
    return login(username, password, null, dependencies).then(result => {
      expect(result.success).to.equal(true)
      expect(result.token).to.equal(token)
    })
  })
})
