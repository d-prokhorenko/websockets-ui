import { randomUUID } from 'crypto';
import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { Player, PlayerDataMessage } from '../interfaces/player.interface.js';
import { MessageSendType } from '../types/message-type.type.js';
import { RoomUser, UpdateRoomStateDataSend } from '../interfaces/room.interface.js';
import { WebSocket } from 'ws';
import { GameData, WinnersData } from '../interfaces/ships.interface.js';

export const players = new Map<string, Player>();
export const rooms = new Map<number, UpdateRoomStateDataSend>();
export const games = new Map<number, GameData[]>();
export const winners = new Map<WebSocket, WinnersData>();

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

  const isPlayerExist = [...(players.values() || [])].some(({ name }) => name === data.name);

  if (!isPlayerExist) {
    players.set(randomUUID(), {
      ...data,
      ws,
    });

    return response;
  } else {
    return loginPlayer(data);
  }
}

export function loginPlayer(data: PlayerDataMessage): MessageSendType {
  const response = {
    type: MessageTypeEnum.REG,
    data: JSON.stringify({
      name: data.name,
      error: false,
      errorText: '',
    }),
    id: 0,
  };

  const player = [...(players.values() || [])].find(({ name }) => name === data.name);

  if (player?.password === data.password) {
    return response;
  } else {
    return {
      ...response,
      data: JSON.stringify({
        name: data.name,
        error: true,
        errorText: 'Wrong auth data',
      }),
    };
  }
}

export function createRoom(ws: WebSocket): void {
  const roomId = rooms.size;
  const player = getPlayer(ws);
  const roomUsers = [
    {
      ws,
      name: player?.name || '',
      index: 0,
    },
  ];

  rooms.set(roomId, {
    roomId,
    roomUsers,
  });
}

export function createGame(roomUsers: RoomUser[] | undefined): number {
  const [user1, user2] = roomUsers || [];
  const gameId = Math.floor(Math.random() * 1000);

  console.log(gameId);

  const gameData = [
    {
      ws: user1?.ws,
      ships: null,
      attackPositions: [],
      killedShips: 0,
    },
    {
      ws: user2?.ws,
      ships: null,
      attackPositions: [],
      killedShips: 0,
    },
  ];

  games.set(gameId, gameData);

  return gameId;
}

export function getPlayer(ws: WebSocket): Player | undefined {
  return [...(players.values() || [])].find((player) => player.ws === ws);
}
