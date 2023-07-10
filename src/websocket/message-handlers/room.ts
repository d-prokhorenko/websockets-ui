import { WebSocket } from 'ws';
import { createGame, createRoom, getPlayer, players, rooms } from '../../database/database.js';
import { MessageTypeEnum } from '../../enum/message-type.enum.js';
import { MessageSendType } from '../../types/message-type.type.js';
import { AddUserToRoomMessageDataMessage, RoomUser } from '../../interfaces/room.interface.js';
import { clients } from '../index.js';

export function getUpdateRoomResponse(): MessageSendType {
  return {
    type: MessageTypeEnum.UPDATE_ROOM,
    data: JSON.stringify(rooms.size ? [...rooms.values()] : []),
    id: 0,
  };
}

export function handleCreateRoom(ws: WebSocket): void {
  createRoom(ws);
  updateRoomForAllClients();
}

export function handleAddUserToRoom(ws: WebSocket, data: AddUserToRoomMessageDataMessage): void {
  const roomId = data.indexRoom;
  addUserToRoom(ws, roomId);
  createGameForRoomUsers(roomId);
  rooms.delete(roomId);
  updateRoomForAllClients();
}

function addUserToRoom(ws: WebSocket, roomId: number): void {
  const room = rooms.get(roomId);
  const player = getPlayer(ws);

  room?.roomUsers?.push({
    ws,
    name: player?.name || '',
    index: 1,
  });
}

function updateRoomForAllClients(): void {
  const updateRoomResponse = JSON.stringify(getUpdateRoomResponse());

  for (const client of clients) {
    client.send(updateRoomResponse);
  }
}

function createGameForRoomUsers(roomId: number) {
  const roomUsers = rooms.get(roomId)?.roomUsers;

  const idGame = createGame(roomUsers);

  roomUsers?.forEach(({ ws }: RoomUser, index: number) => {
    ws.send(
      JSON.stringify({
        type: MessageTypeEnum.CREATE_GAME,
        data: JSON.stringify({
          idGame,
          idPlayer: index,
        }),
        id: 0,
      }),
    );
  });
}
