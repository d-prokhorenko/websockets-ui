import WebSocket, { WebSocketServer } from 'ws';

const WEB_SOCKET_PORT = 3000;

export const wss = new WebSocketServer({
  port: WEB_SOCKET_PORT,
});

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message: string) => {
    const request = JSON.parse(message);
    console.log(request);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
