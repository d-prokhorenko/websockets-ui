import { AttackMessage, RandomAttackMessage } from '../interfaces/game.interface.js';
import { PlayerLoginMessage } from '../interfaces/player.interface.js';
import { AddUserToRoomMessage, CreateNewRoomMessage } from '../interfaces/room.interface.js';
import { AddShipMessage } from '../interfaces/ships.interface.js';

export type MessageType =
  | PlayerLoginMessage
  | CreateNewRoomMessage
  | AddUserToRoomMessage
  | AddShipMessage
  | AttackMessage
  | RandomAttackMessage;
