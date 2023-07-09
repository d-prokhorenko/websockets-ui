import { games } from '../../database/database.js';
import { MessageTypeEnum } from '../../enum/message-type.enum.js';
import { AddShipMessageData, GameData } from '../../interfaces/ships.interface.js';

export function handleAddShips(data: AddShipMessageData): void {
  const { gameId, ships, indexPlayer } = data;
  const game = games.get(gameId);

  if (game) {
    if (game[indexPlayer]) {
      game[indexPlayer].ships = ships;
    }

    if (areShipsAddedForAllPlayers(game)) {
      game.forEach(({ ws, ships }: GameData, index: number) => {
        ws.send(
          JSON.stringify({
            type: MessageTypeEnum.START_GAME,
            data: JSON.stringify({ ships, currentPlayerIndex: index }),
            id: 0,
          }),
        );
      });
    }
  }
}

function areShipsAddedForAllPlayers(game: GameData[]): boolean {
  return game.every(({ ships }) => Boolean(ships));
}
