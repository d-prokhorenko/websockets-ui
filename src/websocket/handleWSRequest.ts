import WebSocket from 'ws';
import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { MessageSendType, MessageType, MessageTypeData } from '../types/message-type.type.js';
import { handleREG } from './message-handlers/reg.js';
import { PlayerDataMessage } from '../interfaces/player.interface.js';
import { getUpdateRoomResponse, handleAddUserToRoom, handleCreateRoom } from './message-handlers/room.js';
import { AddUserToRoomMessageDataMessage } from '../interfaces/room.interface.js';
import { handleAddShips } from './message-handlers/ship.js';
import { AddShipMessageData } from '../interfaces/ships.interface.js';
import { handleAttack, handleRandomAttack } from './message-handlers/game.js';
import { AttackMessageData, RandomAttackMessageData } from '../interfaces/game.interface.js';

function sendUpdateRoomMessage(ws: WebSocket): void {
  ws.send(JSON.stringify(getUpdateRoomResponse()));
}

function sendResponseMessage(ws: WebSocket, response: MessageSendType): void {
  ws.send(JSON.stringify(response));
}

export function handleWSRequest(ws: WebSocket, request: MessageType): void {
  console.log('Request', request);

  const data: MessageTypeData = request.data ? JSON.parse(request.data as string) : null;
  let response: MessageSendType;

  switch (request.type) {
    case MessageTypeEnum.REG:
      response = handleREG(ws, data as PlayerDataMessage);
      sendResponseMessage(ws, response);
      sendUpdateRoomMessage(ws);
      break;

    case MessageTypeEnum.CREATE_ROOM:
      handleCreateRoom(ws);
      break;

    case MessageTypeEnum.ADD_USER_TO_ROOM:
      handleAddUserToRoom(ws, data as AddUserToRoomMessageDataMessage);
      break;

    case MessageTypeEnum.ADD_SHIPS:
      handleAddShips(data as AddShipMessageData);

      break;

    case MessageTypeEnum.ATTACK:
      handleAttack(data as AttackMessageData);

      break;

    case MessageTypeEnum.RANDOM_ATTACK:
      handleRandomAttack(data as RandomAttackMessageData);

      break;

    default:
      break;
  }
}
