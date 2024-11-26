import { Vaccine } from "./vaccine";

export interface VaccineDetail   {
  Vaccine: Vaccine,
  DeviceId: Array<string>,
  AverageValue: number,
  HighestValue: number,
  DateHighestValue: string,
  TimeHighestValue: string,
  LowestValue: number,
  DateLowestValue: string,
  TimeLowestValue: string,
  DateRangeStart: string,
  DateRangeEnd: string,
  NumberRecords: number
}
