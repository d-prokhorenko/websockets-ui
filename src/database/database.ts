import { MessageTypeEnum } from '../enum/message-type.enum.js';
import { Player, PlayerDataMessage, PlayerLoginSend } from '../interfaces/player.interface.js';
import { MessageSendType } from '../types/message-type.type.js';

export const players = new Map<string, Player>();

export function registrationPlayer(data: PlayerDataMessage): MessageSendType {
  const response = {
    type: MessageTypeEnum.REG,
    data: JSON.stringify({
      name: data.name,
      error: false,
      errorText: '',
    }),
    id: 0,
  };

  if (!players.has(data.name)) {
    players.set(data.name, data);

    return response;
  } else {
    return {
      ...response,
      data: JSON.stringify({
        name: data.name,
        error: true,
        errorText: 'Player already exist',
      }),
    };
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

  if (players.has(data.name)) {
    return response;
  } else {
    return {
      ...response,
      data: JSON.stringify({
        name: data.name,
        error: true,
        errorText: "Player doesn't exist",
      }),
    };
  }
}
