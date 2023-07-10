import { WebSocket } from 'ws';
import { registrationPlayer, winners } from '../../database/database.js';
import { PlayerDataMessage } from '../../interfaces/player.interface.js';
import { MessageSendType } from '../../types/message-type.type.js';
import { MessageTypeEnum } from '../../enum/message-type.enum.js';
import { clients } from '../index.js';

export function handleREG(ws: WebSocket, data: PlayerDataMessage): MessageSendType {
  return registrationPlayer(ws, data);
}

export function updateWinners(): void {
  const updatedWinners = JSON.stringify({
    type: MessageTypeEnum.UPDATE_WINNERS,
    data: JSON.stringify(winners.size ? [...winners.values()] : []),
    id: 0,
  });

  for (const client of clients) {
    client.send(updatedWinners);
  }
}
