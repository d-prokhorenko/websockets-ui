import { MessageTypeEnum } from '../enum/message-type.enum.js';

export interface Player {
  name: string;
  password: string;
}
export interface PlayerLoginMessage {
  type: MessageTypeEnum.REG;
  data: PlayerDataMessage;
  id: number;
}

export interface PlayerDataMessage {
  name: string;
  password: string;
}

export interface PlayerLoginSend {
  type: MessageTypeEnum.REG;
  data: PlayerDataSend;
  id: number;
}

export interface PlayerDataSend {
  name: string;
  error: boolean;
  errorText: string;
}

export interface UpdateWinnersSend {
  type: MessageTypeEnum.UPDATE_WINNERS;
  data: UpdateWinnersDataSend[];
  id: number;
}

export interface UpdateWinnersDataSend {
  name: string;
  wind: number;
}
