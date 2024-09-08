import type { PlatformAccessory, Service } from 'homebridge';

import type { HttpClimateSensorPlatform } from './platform.js';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory the platform registers.
 */

export class HttpClimateSensorPlatformAccessory
{
    constructor(private readonly platform: HttpClimateSensorPlatform, private readonly accessory: PlatformAccessory)
    {
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)!
            .setCharacteristic(this.platform.Characteristic.Manufacturer, accessory.context.device.manufacturer || 'Device-Manufacturer')
            .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.model || 'Default-Model')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.serial || 'Default-Serial');

        const temperatureSensorService = this.accessory.context.device.temperature ? (this.accessory.getService('Temperature Sensor') || this.accessory.addService(this.platform.Service.TemperatureSensor, 'Temperature Sensor', 'Temperature-Sensor')) : undefined;
        const humiditySensorService = this.accessory.context.device.humidity ? (this.accessory.getService('Humidity Sensor') || this.accessory.addService(this.platform.Service.HumiditySensor, 'Humidity Sensor', 'Humidity-Sensor')) : undefined;

        this.GetReadings(this.accessory.context.device, temperatureSensorService, humiditySensorService);

        setInterval(() =>
        {
            this.GetReadings(this.accessory.context.device, temperatureSensorService, humiditySensorService);
        }, accessory.context.device.updateInterval * 1000);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    async GetReadings(device: any, temperatureSensorService?: Service, humiditySensorService?: Service)
    {
        try
        {
            const response = await fetch(device.endpoint.url, { method: device.endpoint.method || 'GET', headers: device.endpoint.headers || {} });
            const data = await response.json();

            if (temperatureSensorService !== undefined)
            {
                const temperatureKey = device.temperature.key || 'temperature';
                const temperature = this.GetValueFromJson(data, temperatureKey)
                if (temperature !== undefined)
                {
                    temperatureSensorService.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, temperature);
                }
            }

            if (humiditySensorService !== undefined)
            {
                const humidityKey = device.humidity.key || 'humidity';
                const humidity = this.GetValueFromJson(data, humidityKey)
                if (humidity !== undefined)
                {
                    humiditySensorService.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, humidity);
                }
            }
        }
        catch (error)
        {
            this.platform.log.info('An error occurred when getting readings:', error);
        }
    }

    GetValueFromJson(jsonData: any, keyPath: string)
    {
        const keys = keyPath.split('.');

        return keys.reduce((previous, key) =>
        {
            if (previous && Object.hasOwn(previous, key))
            {
                return previous[key];
            }

            return undefined;
        }, jsonData);
    }
}