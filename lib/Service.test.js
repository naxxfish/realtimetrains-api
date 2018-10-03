const AssertionError = require('assert').AssertionError
const Service = require('./Service')
const axios = require('axios')
const AxiosMockAdapter = require('axios-mock-adapter')
const axiosMock = new AxiosMockAdapter(axios)

const CONFIG = {
  'uri': 'https://api.rtt.io/api/v1/',
  'username': 'testuser',
  'password': 'testpassword'
}
const TEST_FIXTURE = {
  'serviceUid': 'W72419',
  'runDate': '2013-06-11',
  'serviceType': 'train',
  'isPassenger': true,
  'trainIdentity': '2A61',
  'powerType': 'EMU',
  'trainClass': 'B',
  'atocCode': 'SN',
  'atocName': 'Southern',
  'performanceMonitored': true,
  'origin': [
    {
      'tiploc': 'BRGHTN',
      'description': 'Brighton',
      'workingTime': '230500',
      'publicTime': '2305'
    }
  ],
  'destination': [
    {
      'tiploc': 'VICTRIC',
      'description': 'London Victoria',
      'workingTime': '003900',
      'publicTime': '0039'
    }
  ],
  'locations': [
    {
      'realtimeActivated': true,
      'tiploc': 'BRGHTN',
      'crs': 'BTN',
      'description': 'Brighton',
      'wttBookedDeparture': '230500',
      'gbttBookedDeparture': '2305',
      'origin': [
        {
          'tiploc': 'BRGHTN',
          'description': 'Brighton',
          'workingTime': '230500',
          'publicTime': '2305'
        }
      ],
      'destination': [
        {
          'tiploc': 'VICTRIC',
          'description': 'London Victoria',
          'workingTime': '003900',
          'publicTime': '0039'
        }
      ],
      'isCall': true,
      'isPublicCall': true,
      'realtimeDeparture': '2304',
      'realtimeDepartureActual': true,
      'realtimeGbttDepartureLateness': null,
      'platform': '6',
      'platformConfirmed': true,
      'platformChanged': false,
      'line': 'M',
      'lineConfirmed': true,
      'displayAs': 'ORIGIN'
    }
  ],
  'realtimeActivated': true,
  'runningIdentity': '2A61'
}
describe('Service', () => {
  test('should be an object', () => {
    expect(Service).toBeInstanceOf(Function)
  })
  test('should throw an exception if not passed a config object', () => {
    expect(() => {
      return new Service()
    }).toThrow(AssertionError)
  })
  test('should throw an exception if not passed uri in config', () => {
    expect(() => {
      return new Service({})
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed username/password in the config', () => {
    expect(() => {
      return new Service({ 'uri': CONFIG.uri })
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed password in the config', () => {
    expect(() => {
      return new Service({ 'uri': CONFIG.uri, 'username': CONFIG.username })
    }).toThrow(AssertionError)
  })
  test('should create an object OK if a uri is passed in the config', () => {
    expect(() => {
      return new Service(CONFIG)
    }).not.toThrow()
  })
  describe('getService', () => {
    test('should throw an AssertionError if not passed a service', () => {
      var service = new Service(CONFIG)
      expect(() => {
        service.getService({})
      }).toThrow(AssertionError)
    })
    test('should throw a AssertionError if passed a service that is not a string', () => {
      var service = new Service(CONFIG)
      expect(() => {
        service.getService({ 'service': 123 })
      }).toThrow(AssertionError)
      expect(() => {
        service.getService({ 'service': null })
      }).toThrow(AssertionError)
      expect(() => {
        service.getService({ 'service': false })
      }).toThrow(AssertionError)
    })
    test('should make a GET request to /json/search/station', () => {
      var service = new Service(CONFIG)
      axiosMock.onGet('/v1/json/service/search/W72419').reply(200, TEST_FIXTURE)
      expect(service.getService({ 'service': 'W72419' }).then((listing) => {
        expect(listing).toEqual(TEST_FIXTURE)
      }))
    })
  })
})
