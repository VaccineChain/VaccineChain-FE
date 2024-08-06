import { Device } from "./device";
import { Vaccine } from "./vaccine";

export interface Log {
  Vaccine: Vaccine,
  Device: Device,
  Value: number,
  Unit: string,
  Timestamp: string,
  Status: number,
}
