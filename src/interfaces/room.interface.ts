import { MessageType } from '../enum/message-type.enum.js';

export interface CreateNewRoomMessage {
  type: MessageType.CREATE_ROOM;
  data: string;
  id: number;
}

export interface AddUserToRoomMessage {
  type: MessageType.ADD_USER_TO_ROOM;
  data: AddUserToRoomMessageDataMessage;
  id: number;
}

export interface AddUserToRoomMessageDataMessage {
  indexRoom: number;
}

export interface CreateGameSend {
  type: MessageType.CREATE_GAME;
  data: CreateGameDataSend;
  id: number;
}

export interface CreateGameDataSend {
  idGame: number;
  idPlayer: number;
}

export interface UpdateRoomStateSend {
  type: MessageType.UPDATE_ROOM;
  data: UpdateRoomStateDataSend[];
  id: number;
}

export interface UpdateRoomStateDataSend {
  roomId: number;
  roomUsers: RoomUsers[];
}

export interface RoomUsers {
  name: string;
  index: number;
}
