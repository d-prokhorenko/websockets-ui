import { WebSocket } from 'ws';
import { loginPlayer, players, registrationPlayer } from '../../database/database.js';
import { PlayerDataMessage } from '../../interfaces/player.interface.js';
import { MessageSendType } from '../../types/message-type.type.js';

export function handleREG(ws: WebSocket, data: PlayerDataMessage): MessageSendType {
  if (!players.has(ws)) {
    return registrationPlayer(ws, data);
  } else {
    return loginPlayer(ws, data);
  }
}
