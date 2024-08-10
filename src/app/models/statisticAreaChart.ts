export interface statisticAreaChart {
  DeviceId: string,
  SensorValue: Array<SensorValue>,
}

// create SensorValue Object: Value, Timestamp
export interface SensorValue {
  Value: number,
  Timestamp: string,
}

