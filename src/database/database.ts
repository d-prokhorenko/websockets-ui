import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { Player, PlayerDataMessage } from '../interfaces/player.interface.js';
import { MessageSendType } from '../types/message-type.type.js';
import { UpdateRoomStateDataSend } from '../interfaces/room.interface.js';
import { WebSocket } from 'ws';

export const players = new Map<WebSocket, Player>();
export const rooms = new Map<number, UpdateRoomStateDataSend>();

export function registrationPlayer(ws: WebSocket, data: PlayerDataMessage): MessageSendType {
  const response = {
    type: MessageTypeEnum.REG,
    data: JSON.stringify({
      name: data.name,
      error: false,
      errorText: '',
    }),
    id: 0,
  };

  if (!players.has(ws)) {
    players.set(ws, data);

    return response;
  } else {
    return {
      ...response,
      data: JSON.stringify({
        name: data.name,
        error: true,
        errorText: 'Player already exist',
      }),
    };
  }
}

export function loginPlayer(ws: WebSocket, data: PlayerDataMessage): MessageSendType {
  const response = {
    type: MessageTypeEnum.REG,
    data: JSON.stringify({
      name: data.name,
      error: false,
      errorText: '',
    }),
    id: 0,
  };

  if (players.has(ws)) {
    return response;
  } else {
    return {
      ...response,
      data: JSON.stringify({
        name: data.name,
        error: true,
        errorText: "Player doesn't exist",
      }),
    };
  }
}

export function createRoom(ws: WebSocket): void {
  const roomId = rooms.size;
  const roomUsers = [
    {
      ws,
      name: players.get(ws)?.name || '',
      index: 0,
    },
  ];

  rooms.set(roomId, {
    roomId,
    roomUsers,
  });
}
