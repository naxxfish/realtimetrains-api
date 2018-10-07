# 🚆 Realtimetrains.co.uk API Client
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![codecov](https://codecov.io/gh/naxxfish/realtimetrains-api/branch/master/graph/badge.svg)](https://codecov.io/gh/naxxfish/realtimetrains-api)

This module allows you to use the API from [Realtimetrains.co.uk](https://realtimetrains.co.uk), which provides access to rail information across the Great British rail network.

# Getting Started

## Prerequisites
You will need to sign up for an account to get access to the API, see the [realtimetrains.co.uk API documentation](http://www.realtimetrains.co.uk/api) for more information.  

## Installing

Simply install the module

    npm install --save realtimetrains


## Using

The API is Promises based and, in fact, is a thin wrapper over some Axios requests.  

```
var RealtimetrainsClient = require('./main')

var rttClient = new RealtimetrainsClient({})
rttClient.getLocationList({ 'station': 'CHX' }).then((locationList) => {
  console.log(locationList.data)
})

```
Which will get you something like...
```
{ location: { name: 'London Charing Cross', crs: 'CHX', tiploc: 'CHRX' },
  filter: null,
  services:
   [ { locationDetail: [Object],
       serviceUid: 'W45286',
       runDate: '2018-10-07',
       trainIdentity: '2L58',
       runningIdentity: '2L58',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'W44809',
       runDate: '2018-10-07',
       trainIdentity: '1H46',
       runningIdentity: '1H46',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'W45368',
       runDate: '2018-10-07',
       trainIdentity: '2N60',
       runningIdentity: '2N60',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'J69441',
       runDate: '2018-10-07',
       trainIdentity: '2V62',
       runningIdentity: '2V62',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'W45287',
       runDate: '2018-10-07',
       trainIdentity: '2L60',
       runningIdentity: '2L60',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'W44810',
       runDate: '2018-10-07',
       trainIdentity: '1H48',
       runningIdentity: '1H48',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'W45371',
       runDate: '2018-10-07',
       trainIdentity: '2N66',
       runningIdentity: '2N66',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true },
     { locationDetail: [Object],
       serviceUid: 'J69442',
       runDate: '2018-10-07',
       trainIdentity: '2V64',
       runningIdentity: '2V64',
       atocCode: 'SE',
       atocName: 'Southeastern',
       serviceType: 'train',
       isPassenger: true } ] }
```
## Methods

The methods are very light wrappers around the Realtimetrains Pull api

All methods accept an object for specifying the query.

### ```getLocationList```
See the [LocationList documentation](http://www.realtimetrains.co.uk/api/pull/locationlist)

You must specify a station, and can optionally specify a toStation OR a date/time

    rttClient.getLocationList({
     'station': 'CHX' // the station to get the location list for
     'date': '2018/09/08' // the date to filter on, in YYYY/MM/DD format
     'time': '0900' // the time in HHMM format
     })

OR

     rttClient.getLocationList({
      'station': 'CHX' // the station to get the location list for
      'toStation': 'CBW' // filter out service to this location
      })

### ```getService```
Retrieve a service using it's service UID and running Date

    rttClient.getService({
      'service' : 'W45286', // the serviceUid
      'date': '2018/10/07' // the date on which it runs in YYYY/MM/DD format
      })

## Licence
