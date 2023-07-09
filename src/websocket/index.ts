import WebSocket, { WebSocketServer } from 'ws';
import { handleWSRequest } from './handleWSRequest.js';
import { MessageType } from '../types/message-type.type.js';

const WEB_SOCKET_PORT = 3000;

const wss = new WebSocketServer({
  port: WEB_SOCKET_PORT,
});

export const clients = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  clients.add(ws);

  ws.on('message', (message: string) => {
    const request: MessageType = JSON.parse(message);
    handleWSRequest(ws, request);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});
