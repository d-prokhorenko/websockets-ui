import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { ShipType } from '../enum/ship-type.enum.js';
import { Position } from './common.interface.js';

export interface AddShipMessage {
  type: MessageTypeEnum.ADD_SHIPS;
  data: AddShipMessageData;
  id: number;
}

export interface AddShipMessageData {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}

export interface StartGameSend {
  type: MessageTypeEnum.START_GAME;
  data: StartGameDataSend;
  id: number;
}

export interface StartGameDataSend {
  ships: StartGameDataSendShips[];
  currentPlayerIndex: number;
}

export interface StartGameDataSendShips {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}
