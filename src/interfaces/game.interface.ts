import { AttackStatus } from '../enum/attack-status.enum.js';
import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { Position } from './common.interface.js';

export interface AttackMessage {
  type: MessageTypeEnum.ATTACK;
  data: AttackMessageData;
  id: number;
}

export interface AttackMessageData {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}

export interface AttackSend {
  type: MessageTypeEnum.ATTACK;
  data: AttackSendData;
  id: number;
}

export interface AttackSendData {
  position: Position;
  currentPlayer: number;
  status: AttackStatus;
}

export interface RandomAttackMessage {
  type: MessageTypeEnum.RANDOM_ATTACK;
  data: RandomAttackMessageData;
  id: number;
}

export interface RandomAttackMessageData {
  gameId: number;
  indexPlayer: number;
}

export interface TurnSend {
  type: MessageTypeEnum.TURN;
  data: TurnSendData;
  id: number;
}

export interface TurnSendData {
  currentPlayer: number;
}

export interface FinishSend {
  type: MessageTypeEnum.FINISH;
  data: FinishSendData;
  id: number;
}

export interface FinishSendData {
  winPlayer: number;
}
