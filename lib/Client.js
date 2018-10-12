const axios = require('axios')
var assert = require('assert')

function RealtimetrainsClient (config) {
  assert(config instanceof Object)
  this.config = config
  if (this.config.hasOwnProperty('uri')) {
    assert(typeof this.config.uri === 'string', 'API base URI must be of type string')
  } else {
    this.config.uri = 'https://api.rtt.io/api/v1/' // use this default
  }
  /*
   * If neither username nor password have been specified in the object
   * try loading the environment variable in instead
   */
  if (!(this.config.hasOwnProperty('username') && this.config.hasOwnProperty('password'))) {
    if (process.env.RTT_USERNAME && process.env.RTT_PASSWORD) {
      this.config.username = process.env.RTT_USERNAME
      this.config.password = process.env.RTT_PASSWORD
    }
  }
  assert(this.config.hasOwnProperty('username'), 'A username must be specified')
  assert(typeof this.config.username === 'string', 'A username must be of type string')

  assert(this.config.hasOwnProperty('password'), 'A password must be specified')
  assert(typeof this.config.password === 'string', 'A password must be of type string')
  this.axios = axios.create({
    baseURL: this.config.uri,
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
RealtimetrainsClient.prototype.getLocationList = function (query) {
  assert(query instanceof Object, 'Argument must be an Object')
  assert(query.hasOwnProperty('station'), 'Must specify station')
  assert(typeof query.station === 'string', 'Station must be of type string')
  // toStation overrides date/time
  var firstPart = query.station
  if (query.hasOwnProperty('toStation')) {
    assert(typeof query.toStation === 'string')
    firstPart = query.station + '/to/' + query.toStation
  }
  if (query.hasOwnProperty('date')) {
    assert(typeof query.date === 'string', 'Date must be a string')
    assert(query.date.match(/(\d\d\d\d)(\/([0-1][0-9]))*(\/([0-3][0-9]))*/), 'Date must be in format YYYY/MM/DD')
    if (query.hasOwnProperty('time')) {
      assert(typeof query.time === 'string', 'Time must be a string')
      assert(query.time.match(/[0-2]\d[0-5]\d/), 'Time must be in format HHMM')
      return this.axios.get('/json/search/' + firstPart + '/' + query.date + '/' + query.time)
    } else {
      return this.axios.get('/json/search/' + firstPart + '/' + query.date)
    }
  } else {
    return this.axios.get('/json/search/' + firstPart)
  }
}

/*
 * Retrieves a LoctionList from the Realtimetrains Pull API
 * @param {object} query - includes at minimum a station code
 */
RealtimetrainsClient.prototype.getService = function (query) {
  assert(query instanceof Object, 'Argument must be an objects')
  assert(query.hasOwnProperty('service'), 'Must specify service')
  assert(typeof query.service === 'string', 'Service must be of type string')
  if (query.hasOwnProperty('date')) {
    assert(typeof query.date === 'string', 'Date must be a string')
    assert(query.date.match(/(\d\d\d\d)(\/([0-1][0-9]))*(\/([0-3][0-9]))*/), 'Date must be in format YYYY/MM/DD')
    return this.axios.get('/json/service/' + query.service + '/' + query.date)
  } else {
    return this.axios.get('/json/service/' + query.service)
  }
}

module.exports = RealtimetrainsClient
