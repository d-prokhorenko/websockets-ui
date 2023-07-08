import { MessageTypeEnum } from '../enum/message-type.enum.js';
import {
  AttackMessage,
  AttackMessageData,
  RandomAttackMessage,
  RandomAttackMessageData,
} from '../interfaces/game.interface.js';
import { PlayerDataMessage, PlayerLoginMessage } from '../interfaces/player.interface.js';
import {
  AddUserToRoomMessage,
  AddUserToRoomMessageDataMessage,
  CreateNewRoomMessage,
} from '../interfaces/room.interface.js';
import { AddShipMessage, AddShipMessageData } from '../interfaces/ships.interface.js';

export type MessageType =
  | PlayerLoginMessage
  | CreateNewRoomMessage
  | AddUserToRoomMessage
  | AddShipMessage
  | AttackMessage
  | RandomAttackMessage;

export type MessageTypeData =
  | PlayerDataMessage
  | string
  | AddUserToRoomMessageDataMessage
  | AddShipMessageData
  | AttackMessageData
  | RandomAttackMessageData;

export interface MessageSendType {
  type: MessageTypeEnum;
  data: string;
  id: number;
}
