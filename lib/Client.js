const axios = require('axios')
var assert = require('assert')

function RealtimetrainsClient (config) {
  assert(config instanceof Object)
  assert(config.hasOwnProperty('uri'))
  assert(typeof config.uri === 'string')
  assert(config.hasOwnProperty('username'))
  assert(typeof config.username === 'string')
  assert(config.hasOwnProperty('password'))
  assert(typeof config.password === 'string')
  this.config = config
}

/*
 * Retrieves a LoctionList from the Realtimetrains Pull API
 * @param {object} query - includes at minimum a station code
 */
RealtimetrainsClient.prototype.getLocationList = function (query) {
  assert(query instanceof Object)
  assert(query.hasOwnProperty('station'))
  assert(typeof query.station === 'string')
  if (query.hasOwnProperty('toStation')) {
    assert(typeof query.toStation === 'string')
  }
  return axios.get(this.config.uri + '/json/search/' + query.station, {
    auth: {
      username: this.config.username,
      password: this.config.password
    }
  })
}

/*
 * Retrieves a LoctionList from the Realtimetrains Pull API
 * @param {object} query - includes at minimum a station code
 */
RealtimetrainsClient.prototype.getService = function (query) {
  assert(query instanceof Object)
  assert(query.hasOwnProperty('service'))
  assert(typeof query.service === 'string')
  if (query.hasOwnProperty('date')) {
    assert(typeof query.date === 'string')
    assert(query.date.match(/(\d\d\d\d)(\/([0-1][0-9]))*(\/([0-3][0-9]))*/))
    return axios.get(this.config.uri + '/json/service/' + query.service + '/' + query.date)
  } else {
    return axios.get(this.config.uri + '/json/service/' + query.service)
  }
}

module.exports = RealtimetrainsClient
