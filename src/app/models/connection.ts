import { Device } from './device';
import { Vaccine } from './vaccine';

export interface Connection {
  Status: string;
  Vaccine: Vaccine;
  Device: Device;
}
