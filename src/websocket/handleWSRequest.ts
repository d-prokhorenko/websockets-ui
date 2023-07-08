import WebSocket from 'ws';
import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { MessageSendType, MessageType, MessageTypeData } from '../types/message-type.type.js';
import { handleREG } from './message-handlers/reg.js';
import { PlayerDataMessage } from '../interfaces/player.interface.js';

export function handleWSRequest(ws: WebSocket, request: MessageType): void {
  console.log('Request', request);

  const data: MessageTypeData = request.data ? JSON.parse(request.data as string) : null;

  let response: MessageSendType | null = null;

  switch (request.type) {
    case MessageTypeEnum.REG:
      response = handleREG(data as PlayerDataMessage);
      break;

    default:
      break;
  }

  console.log('Response', response);

  ws.send(JSON.stringify(response));
}
