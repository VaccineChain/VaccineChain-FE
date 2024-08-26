import { Device } from "./device";
import { Vaccine } from "./vaccine";

export interface Connection {
  Vaccine: Vaccine,
  Device: Device
}
