const AssertionError = require('assert').AssertionError
const axios = require('axios')
const AxiosMockAdapter = require('axios-mock-adapter')
const axiosMock = new AxiosMockAdapter(axios)
const RealtimeTrainsClient = require('./Client')

const CONFIG = {
  'uri': 'https://api.rtt.io/api/v1/',
  'username': 'testuser',
  'password': 'testpassword'
}

const LOCATION_TEST_FIXTURE = {
  'location': {
    'name': 'London Charing Cross',
    'crs': 'CHX',
    'tiploc': 'LCHX'
  },
  'filter': null,
  'services': []
}

const SERVICE_TEST_FIXTURE = {
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

describe('Client', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    jest.resetModules() // this is important
    process.env = OLD_ENV
    delete process.env.RTT_USERNAME
    delete process.env.RTT_PASSWORD
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('should be an object', () => {
    expect(RealtimeTrainsClient).toBeInstanceOf(Function)
  })
  test('should load username/password from env vars, even when passed not passed in from the config', () => {
    process.env.RTT_USERNAME = 'test_env_user'
    process.env.RTT_PASSWORD = 'test_env_password'
    var client = new RealtimeTrainsClient({})
    expect(client.config.username).toEqual(process.env.RTT_USERNAME)
    expect(client.config.password).toEqual(process.env.RTT_PASSWORD)
  })
  test('should throw an exception if not passed a config object', () => {
    expect(() => {
      return new RealtimeTrainsClient()
    }).toThrow(AssertionError)
  })
  test('should throw an exception if not passed uri in config', () => {
    expect(() => {
      return new RealtimeTrainsClient({})
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed username/password in the config', () => {
    expect(() => {
      return new RealtimeTrainsClient({ 'uri': CONFIG.uri })
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed password in the config', () => {
    expect(() => {
      return new RealtimeTrainsClient({ 'uri': CONFIG.uri, 'username': CONFIG.username })
    }).toThrow(AssertionError)
  })
  test('should create an object OK if a uri is passed in the config', () => {
    expect(() => {
      return new RealtimeTrainsClient(CONFIG)
    }).not.toThrow()
  })
  describe('getLocationList', () => {
    test('should throw an AssertionError if not passed a station', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      expect(() => {
        client.getLocationList({})
      }).toThrow(AssertionError)
    })
    test('should throw a AssertionError if passed a station that is not a string', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      expect(() => {
        client.getLocationList({ 'station': 123 })
      }).toThrow(AssertionError)
      expect(() => {
        client.getLocationList({ 'station': null })
      }).toThrow(AssertionError)
      expect(() => {
        client.getLocationList({ 'station': false })
      }).toThrow(AssertionError)
    })
    test('should throw a AssertionError if the toStation is not a string', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      expect(() => {
        client.getLocationList({ 'station': 'CHX', 'toStation': 123 })
      }).toThrow(AssertionError)
      expect(() => {
        client.getLocationList({ 'station': 'CHX', 'toStation': null })
      }).toThrow(AssertionError)
      expect(() => {
        client.getLocationList({ 'station': 'CHX', 'toStation': false })
      }).toThrow(AssertionError)
    })
    test('should make a GET request to /json/search/station', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      axiosMock.onGet('/v1/json/search/CHX').reply(200, LOCATION_TEST_FIXTURE)
      expect(client.getLocationList({ 'station': 'CHX' }).then((listing) => {
        expect(listing).toEqual(LOCATION_TEST_FIXTURE)
      }))
    })
    test('should make a GET request to /json/search/station/to/toStation', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      axiosMock.onGet('/v1/json/search/CHX/to/VIC').reply(200, LOCATION_TEST_FIXTURE)
      expect(client.getLocationList({ 'station': 'CHX', 'toStation': 'VIC' }).then((listing) => {
        expect(listing).toEqual(LOCATION_TEST_FIXTURE)
      }))
    })
    test('should make a GET request to /json/search/station/date', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      axiosMock.onGet('/v1/json/search/CHX/2013/06/11').reply(200, LOCATION_TEST_FIXTURE)
      expect(client.getLocationList({ 'station': 'CHX', 'date': '2013/06/11' }).then((listing) => {
        expect(listing).toEqual(LOCATION_TEST_FIXTURE)
      }))
    })
    test('should make a GET request to /json/search/station/date/time', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      axiosMock.onGet('/v1/json/search/CHX/2013/06/11/0800').reply(200, LOCATION_TEST_FIXTURE)
      expect(client.getLocationList({ 'station': 'CHX', 'date': '2013/06/11', 'time': '0800' }).then((listing) => {
        expect(listing).toEqual(LOCATION_TEST_FIXTURE)
      }))
    })
  })
  test('should throw an exception if not passed a config object', () => {
    expect(() => {
      return new RealtimeTrainsClient()
    }).toThrow(AssertionError)
  })
  test('should throw an exception if not passed uri in config', () => {
    expect(() => {
      return new RealtimeTrainsClient({})
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed username/password in the config', () => {
    expect(() => {
      return new RealtimeTrainsClient({ 'uri': CONFIG.uri })
    }).toThrow(AssertionError)
  })
  test('shoulld throw an exception if not passed password in the config', () => {
    expect(() => {
      return new RealtimeTrainsClient({ 'uri': CONFIG.uri, 'username': CONFIG.username })
    }).toThrow(AssertionError)
  })
  test('should create an object OK if a uri is passed in the config', () => {
    expect(() => {
      return new RealtimeTrainsClient(CONFIG)
    }).not.toThrow()
  })
  describe('getService', () => {
    test('should throw an AssertionError if not passed a service', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      expect(() => {
        client.getService({})
      }).toThrow(AssertionError)
    })
    test('should throw an AssertationError if the date format is incorrect', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      expect(() => {
        client.getService({ 'service': 'W72419', 'date': 'blah' })
      }).toThrow(AssertionError)
    })
    test('should return a service record if specified by date', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      axiosMock.onGet('/v1/json/service/W72419/2013/06/11').reply(200, SERVICE_TEST_FIXTURE)
      expect(() => {
        client.getService({ 'service': 'W72419', 'date': '2013/06/11' }).then((returnedService) => {
          expect(returnedService).toEqual(SERVICE_TEST_FIXTURE)
        })
      }).not.toThrow()
    })
    test('should throw a AssertionError if passed a service that is not a string', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      expect(() => {
        client.getService({ 'service': 123 })
      }).toThrow(AssertionError)
      expect(() => {
        client.getService({ 'service': null })
      }).toThrow(AssertionError)
      expect(() => {
        client.getService({ 'service': false })
      }).toThrow(AssertionError)
    })
    test('should make a GET request to /json/search/station', () => {
      var client = new RealtimeTrainsClient(CONFIG)
      axiosMock.onGet('/v1/json/service/search/W72419').reply(200, SERVICE_TEST_FIXTURE)
      expect(client.getService({ 'service': 'W72419' }).then((listing) => {
        expect(listing).toEqual(SERVICE_TEST_FIXTURE)
      }))
    })
  })
})
