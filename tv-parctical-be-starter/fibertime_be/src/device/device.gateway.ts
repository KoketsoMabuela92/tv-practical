import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DeviceGateway {
  @WebSocketServer()
  server: Server;
  private deviceRooms = new Map<string, string>();
  @SubscribeMessage('joinDevice')
  handleJoinDevice(client: Socket, deviceId: string) {
    this.deviceRooms.forEach((room, clientId) => {
      if (clientId === client.id) {
        client.leave(room);
        this.deviceRooms.delete(clientId);
      }
    });
    client.join(`device_${deviceId}`);
    this.deviceRooms.set(client.id, `device_${deviceId}`);
  }
  notifyConnectionStatus(deviceId: string, isConnected: boolean) {
    this.server.to(`device_${deviceId}`).emit('connectionStatus', { isConnected });
  }
  handleDisconnect(client: Socket) {
    const room = this.deviceRooms.get(client.id);
    if (room) {
      client.leave(room);
      this.deviceRooms.delete(client.id);
    }
  }
}