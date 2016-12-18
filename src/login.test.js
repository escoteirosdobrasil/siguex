const { expect } = require('chai')
const sinon = require('sinon')

const login = require('./login')

describe('login', () => {
  const dependencies = {}
  const mockResult = '{success:false, message: \'test\'}'
  const username = 'any username'
  const password = 'any password'
  const token = '51D116905149BB1329748FA4EA68CBB9'

  beforeEach('prepare mocks and call', () => {
    Object.assign(dependencies, {
      http: {
        post: sinon.stub()
          .withArgs('http://sigue.escoteiros.org.br/sigue/loginSigue.do', 'parseQueryString')
          .returns(Promise.resolve({
            data: mockResult,
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
  })

  it('calls login on sigue parsing as json', () => {
    return login(username, password, dependencies).then(result => {
      expect(result.success).to.equal(false)
      expect(result.message).to.equal('test')
      expect(result.token).to.equal(token)
    })
  })
})
