var assert = require('assert')
const axios = require('axios')
/*
 * Represents a LocationList from the Realtimetrains Pull API
 * @constructor
 */
function LocationList (config) {
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
LocationList.prototype.getLocationList = function (query) {
  assert(query instanceof Object)
  assert(query.hasOwnProperty('station'))
  assert(typeof query.station === 'string')
  if (query.hasOwnProperty('toStation')) {
    assert(typeof query.toStation === 'string')
  }
  return axios.get(this.config.uri + '/json/search/' + query.station)
}

module.exports = LocationList
