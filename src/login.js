const dependencies = {
  http: require('axios'),
  queryString: require('querystring')
}

const NON_NORMALIZEN_JSON_ENTRIES = /(([a-z0-9_-]+):)|('.)|(.')/g
const TOKEN_HEADER = 'set-cookie'
const TOKEN_PREFIX = 'JSESSIONID='
const TOKEN_SEPARATOR = ';'
const LOGIN_URL = 'http://sigue.escoteiros.org.br/sigue/loginSigue.do'

const transformToJSON = (quotedValue, __, key) => {
  if (/'/.test(quotedValue)) {
    return quotedValue.replace('\'', '"')
  }

  return `"${key}":`
}

const parseDataAsObject = ({ data, headers }) => {
  const parsedResponse = JSON.parse(data.replace(NON_NORMALIZEN_JSON_ENTRIES, transformToJSON))
  const setCookieHeader = headers[TOKEN_HEADER] && headers[TOKEN_HEADER][0]

  return Object.assign(parsedResponse, {
    token: setCookieHeader && setCookieHeader.split(TOKEN_SEPARATOR)[0].replace(TOKEN_PREFIX, '')
  })
}

module.exports = function login (username, password, injection) {
  const {
    http,
    queryString
  } = Object.assign({}, dependencies, injection)

  const data = {
    dsLogin: username,
    dsSenha: password
  }

  return http.post(LOGIN_URL, queryString.stringify(data))
    .then(parseDataAsObject)
    .catch(console.trace.bind(console, 'error ::'))
}
