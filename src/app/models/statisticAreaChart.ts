export interface statisticAreaChart {
  DeviceId: string;
  SensorValue: Array<SensorValue>;
}

// create SensorValue Object: Value, Timestamp
export interface SensorValue {
  Value: number;
  Timestamp: string;
}

export interface VaccinesTemperatureRange {
  VaccineName: string;
  HighestTemperature: number;
  LowestTemperature: number;
}

export interface VaccineDeviceStatus {
  VaccineId: string;
  VaccineName: string;
  NumberOfDevices: number;
  Status: string;
}

export interface GetDataCollectionStatus {
  Category: string;
  Collecting: number;
  Completed: number;
}

export interface ConnectionOverview {
  TotalConnection: number;
  NotConnectedDevice: number;
  NotConnectedVaccine: number;
}