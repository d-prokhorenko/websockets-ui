import { loginPlayer, players, registrationPlayer } from '../../database/database.js';
import { PlayerDataMessage } from '../../interfaces/player.interface.js';
import { MessageSendType } from '../../types/message-type.type.js';

export function handleREG(data: PlayerDataMessage): MessageSendType {
  if (!players.has(data.name)) {
    return registrationPlayer(data);
  } else {
    return loginPlayer(data);
  }
}
