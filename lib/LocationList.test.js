const AssertionError = require('assert').AssertionError
const LocationList = require('./LocationList')
const axios = require('axios')
const AxiosMockAdapter = require('axios-mock-adapter')
const axiosMock = new AxiosMockAdapter(axios)

const CONFIG = {
  'uri': 'https://api.rtt.io/api/v1/',
  'username': 'testuser',
  'password': 'testpassword'
}
describe('LocationList', () => {
  test('should be an object', () => {
    expect(LocationList).toBeInstanceOf(Function)
  })
  test('should throw an exception if not passed a config object', () => {
    expect(() => {
      return new LocationList()
    }).toThrow(AssertionError)
  })
  test('should throw an exception if not passed uri in config', () => {
    expect(() => {
      return new LocationList({})
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed username/password in the config', () => {
    expect(() => {
      return new LocationList({ 'uri': CONFIG.uri })
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed password in the config', () => {
    expect(() => {
      return new LocationList({ 'uri': CONFIG.uri, 'username': CONFIG.username })
    }).toThrow(AssertionError)
  })
  test('should create an object OK if a uri is passed in the config', () => {
    expect(() => {
      return new LocationList(CONFIG)
    }).not.toThrow()
  })
  describe('getLocationList', () => {
    test('should throw an AssertionError if not passed a station', () => {
      var locationList = new LocationList(CONFIG)
      expect(() => {
        locationList.getLocationList({})
      }).toThrow(AssertionError)
    })
    test('should throw a AssertionError if passed a station that is not a string', () => {
      var locationList = new LocationList(CONFIG)
      expect(() => {
        locationList.getLocationList({ 'station': 123 })
      }).toThrow(AssertionError)
      expect(() => {
        locationList.getLocationList({ 'station': null })
      }).toThrow(AssertionError)
      expect(() => {
        locationList.getLocationList({ 'station': false })
      }).toThrow(AssertionError)
    })
    test('should throw a AssertionError if the toStation is not a string', () => {
      var locationList = new LocationList(CONFIG)
      expect(() => {
        locationList.getLocationList({ 'station': 'CHX', 'toStation': 123 })
      }).toThrow(AssertionError)
      expect(() => {
        locationList.getLocationList({ 'station': 'CHX', 'toStation': null })
      }).toThrow(AssertionError)
      expect(() => {
        locationList.getLocationList({ 'station': 'CHX', 'toStation': false })
      }).toThrow(AssertionError)
    })
    test('should make a GET request to /json/search/station', () => {
      var testFixture = {
        'location': {
          'name': 'London Charing Cross',
          'crs': 'CHX',
          'tiploc': 'LCHX'
        },
        'filter': null,
        'services': []
      }
      var locationList = new LocationList(CONFIG)
      axiosMock.onGet('/v1/json/search/CHX').reply(200, testFixture)
      expect(locationList.getLocationList({ 'station': 'CHX' }).then((listing) => {
        expect(listing).toEqual(testFixture)
      }))
    })
  })
})
