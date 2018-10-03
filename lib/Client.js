const axios = require('axios')
const LocationList = require('LocationList')
const Service = require('Service')

function RealtimetrainsClient (config) {
  this.config = config
}

RealtimetrainsClient.prototype.getLocationList = function (params) {
  return LocationList.get(axios, params)
}

RealtimetrainsClient.prototype.getService = function (service) {
  return Service.getService(service)
}

module.exports = RealtimetrainsClient
