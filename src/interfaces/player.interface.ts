import { MessageType } from '../enum/message-type.enum.js';

export interface PlayerLoginMessage {
  type: MessageType.REG;
  data: PlayerDataMessage;
  id: number;
}

export interface PlayerDataMessage {
  name: string;
  password: string;
}

export interface PlayerLoginSend {
  type: MessageType.REG;
  data: PlayerDataSend;
  id: number;
}

export interface PlayerDataSend {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface UpdateWinnersSend {
  type: MessageType.UPDATE_WINNERS;
  data: UpdateWinnersDataSend[];
  id: number;
}

export interface UpdateWinnersDataSend {
  name: string;
  wind: number;
}
