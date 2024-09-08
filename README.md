# homebridge-http-climate-sensor

This is a Homebridge plugin for temperature and humidity sensors that expose their readings over HTTP.

Climate sensors enabled through this plugin appear as temperature and humidity sensors in HomeKit.

### Installation

1. Install [Homebridge](https://homebridge.io/).
1. Install the plugin.
1. Configure the sensors in `config.json`.

### Configuration

```json
{
    "platforms": [
        {
            "platform": "HttpClimateSensor",
            "sensors": [
                {
                    "name": "Simple Temperature Sensor",
                    "endpoint": {
                        "url": "https://api.example.com/sensors/simple"
                    },
                    "temperature": {}
                },
                {
                    "name": "Simple Climate Sensor",
                    "endpoint": {
                        "url": "https://api.example.com/sensors/simple"
                    },
                    "temperature": {},
                    "humidity": {}
                },
                {
                    "name": "Complex Climate Sensor",
                    "endpoint": {
                        "url": "https://api.example.com/sensors/complex",
                        "method": "GET",
                        "headers": {
                            "Authorization": "Bearer bearer-token"
                        }
                    },
                    "temperature": {
                        "key": "temperatureMeasurement.temperature.value"
                    },
                    "humidity": {
                        "key": "relativeHumidityMeasurement.humidity.value"
                    },
                    "updateInterval": 300
                }
            ]
        }
    ]
}
```

### Supported Sensors

This plugin has been tested with climate sensors exposed through the SmartThings API. It should also work with other sensors (physical or virtual) that exposed their readings in a JSON object accessible through HTTP.