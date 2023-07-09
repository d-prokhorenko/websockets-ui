import { games } from '../../database/database.js';
import { AttackStatus } from '../../enum/attack-status.enum.js';
import { MessageTypeEnum } from '../../enum/message-type.enum.js';
import { AttackMessageData } from '../../interfaces/game.interface.js';
import { AttackPosition, GameData } from '../../interfaces/ships.interface.js';

export function handleAttack({ x, y, gameId, indexPlayer }: AttackMessageData): void {
  const game = games.get(gameId);

  if (game) {
    let response: string;

    const enemyShips = game[indexPlayer === 0 ? 1 : 0].ships;
    const attackPositions = game[indexPlayer].attackPositions;

    attackPositions?.push({ x, y });

    if (enemyShips) {
      for (let i = 0; i < enemyShips?.length; i++) {
        const { position, direction, length } = enemyShips[i];

        const xPositions = {
          start: position.x,
          end: direction ? position.x : position.x + length - 1,
        };

        const yPositions = {
          start: position.y,
          end: direction ? position.y + length - 1 : position.y,
        };

        if (x >= xPositions.start && x <= xPositions.end && y >= yPositions.start && y <= yPositions.end) {
          const shipXPositions = direction ? [xPositions.start] : [];
          const shipYPositions = direction ? [] : [yPositions.start];

          for (
            let i = direction ? yPositions.start : xPositions.start;
            i <= (direction ? yPositions.end : xPositions.end);
            i++
          ) {
            direction ? shipYPositions.push(i) : shipXPositions.push(i);
          }

          const attackXPositions: number[] = [];
          const attackYPositions: number[] = [];

          for (let i = 0; i < attackPositions.length; i++) {
            const { x, y } = attackPositions[i];

            if (shipXPositions.includes(x) && shipYPositions.includes(y)) {
              attackXPositions.push(x);
              attackYPositions.push(y);
            }
          }

          const isKilled =
            shipXPositions.every((xPosition: number) => attackXPositions.includes(xPosition)) &&
            shipYPositions.every((yPosition: number) => attackYPositions.includes(yPosition));

          console.log('attackPositions', attackPositions);
          console.log('shipXPositions', shipXPositions);
          console.log('shipYPositions', shipYPositions);
          console.log('attackXPositions', attackXPositions);
          console.log('attackYPositions', attackYPositions);
          console.log('isKilled', isKilled);

          if (isKilled) {
            const killedShoots: AttackPosition[] = [];

            for (let i = 0; i < length; i++) {
              killedShoots.push({
                x: direction ? position.x : position.x + i,
                y: direction ? position.y + i : position.y,
              });
            }

            for (let i = 0; i < killedShoots.length; i++) {
              game.forEach(({ ws }: GameData) => {
                ws.send(
                  JSON.stringify({
                    type: MessageTypeEnum.ATTACK,
                    data: JSON.stringify({
                      position: {
                        x: killedShoots[i].x,
                        y: killedShoots[i].y,
                      },
                      currentPlayer: indexPlayer,
                      status: AttackStatus.KILLED,
                    }),
                    id: 0,
                  }),
                );
              });
            }

            return;
          } else {
            response = JSON.stringify({
              type: MessageTypeEnum.ATTACK,
              data: JSON.stringify({
                position: {
                  x,
                  y,
                },
                currentPlayer: indexPlayer,
                status: AttackStatus.SHOT,
              }),
              id: 0,
            });
          }

          break;
        } else if (i === enemyShips.length - 1) {
          response = JSON.stringify({
            type: MessageTypeEnum.ATTACK,
            data: JSON.stringify({
              position: {
                x,
                y,
              },
              currentPlayer: indexPlayer,
              status: AttackStatus.MISS,
            }),
            id: 0,
          });
        }
      }

      game.forEach(({ ws }: GameData) => {
        ws.send(response);
      });
    }
  }
}
