import { WebSocket } from 'ws';
import { MessageTypeEnum } from '../enum/message-type.enum.js';

export interface CreateNewRoomMessage {
  type: MessageTypeEnum.CREATE_ROOM;
  data: string;
  id: number;
}

export interface AddUserToRoomMessage {
  type: MessageTypeEnum.ADD_USER_TO_ROOM;
  data: AddUserToRoomMessageDataMessage;
  id: number;
}

export interface AddUserToRoomMessageDataMessage {
  indexRoom: number;
}

export interface CreateGameSend {
  type: MessageTypeEnum.CREATE_GAME;
  data: CreateGameDataSend;
  id: number;
}

export interface CreateGameDataSend {
  idGame: number;
  idPlayer: number;
}

export interface UpdateRoomStateSend {
  type: MessageTypeEnum.UPDATE_ROOM;
  data: UpdateRoomStateDataSend[];
  id: number;
}

export interface UpdateRoomStateDataSend {
  roomId: number;
  roomUsers: RoomUser[];
}

export interface RoomUser {
  name: string;
  index: number;
  ws: WebSocket;
}
