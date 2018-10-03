var assert = require('assert')
const axios = require('axios')
/*
 * Represents a LocationList from the Realtimetrains Pull API
 * @constructor
 */
function Service (config) {
  assert(config instanceof Object)
  assert(config.hasOwnProperty('uri'))
  assert(typeof config.uri === 'string')
  assert(config.hasOwnProperty('username'))
  assert(typeof config.username === 'string')
  assert(config.hasOwnProperty('password'))
  assert(typeof config.password === 'string')
  this.config = config
  return this
}
/*
 * Retrieves a LoctionList from the Realtimetrains Pull API
 * @param {object} query - includes at minimum a station code
 */
Service.prototype.getService = function (query) {
  assert(query instanceof Object)
  assert(query.hasOwnProperty('service'))
  assert(typeof query.service === 'string')
  if (query.hasOwnProperty('year')) {
    assert(typeof query.year === 'string')
  }
  if (query.hasOwnProperty('month')) {
    assert(typeof query.month === 'string')
  }
  if (query.hasOwnProperty('day')) {
    assert(typeof query.day === 'string')
  }
  return axios.get(this.config.uri + '/json/service/' + query.service)
}

module.exports = Service
