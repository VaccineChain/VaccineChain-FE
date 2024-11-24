import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7241/temperatureHub', {
        withCredentials: true // Đảm bảo credentials được gửi kèm
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  public startConnection = () => {
    this.hubConnection
      .start()
      .then(() => console.log('Kết nối với Hub thành công'))
      .catch((err) => {
        console.error('Lỗi khi kết nối với Hub: ', err);
        setTimeout(() => this.startConnection(), 5000);
      });

    this.hubConnection.onclose((error) => {
      console.error('Kết nối bị gián đoạn: ', error);
      console.log('Đang thử kết nối lại sau 5 giây...');
      setTimeout(() => this.startConnection(), 5000);
    });
  };

  public addTemperatureDataListener = (callback: (data: any) => void) => {
    this.hubConnection.on('ReceiveTemperatureData', callback);
  };
}
