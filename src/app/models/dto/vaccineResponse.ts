export interface VaccineResponse {
  vaccineId: string;  // vaccine_id từ JSON
  deviceId: string;   // device_id từ JSON
  value: number;      // Giá trị value từ JSON
  createdDate: Date;  // created_date (timestamp) chuyển thành kiểu Date
}
