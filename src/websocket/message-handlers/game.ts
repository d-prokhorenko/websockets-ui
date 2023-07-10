import { games, players, winners } from '../../database/database.js';
import { AttackStatus } from '../../enum/attack-status.enum.js';
import { MessageTypeEnum } from '../../enum/message-type.enum.js';
import { AttackMessageData, RandomAttackMessageData } from '../../interfaces/game.interface.js';
import { AttackPosition, GameData } from '../../interfaces/ships.interface.js';
import { updateWinners } from './reg.js';

export function sendTurnMessage(gameId: number, playerIndex: number): void {
  const game = games.get(gameId);

  const response = JSON.stringify({
    type: MessageTypeEnum.TURN,
    data: JSON.stringify({ currentPlayer: playerIndex }),
    id: 0,
  });

  game?.forEach(({ ws }) => {
    ws.send(response);
  });
}

export function handleAttack({ x, y, gameId, indexPlayer }: AttackMessageData): void {
  const game = games.get(gameId);

  if (game) {
    let response: string;
    let isShoot = false;

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

        isShoot = x >= xPositions.start && x <= xPositions.end && y >= yPositions.start && y <= yPositions.end;

        if (isShoot) {
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

          if (isKilled) {
            const killedShoots: AttackPosition[] = [];
            let missedShoots: AttackPosition[] = [];
            game[indexPlayer].killedShips += 1;

            for (let i = 0; i < length; i++) {
              killedShoots.push({
                x: direction ? position.x : position.x + i,
                y: direction ? position.y + i : position.y,
              });
              missedShoots.push({
                x: direction ? position.x - 1 : position.x + i,
                y: direction ? position.y + i : position.y - 1,
              });
              missedShoots.push({
                x: direction ? position.x + 1 : position.x + i,
                y: direction ? position.y + i : position.y + 1,
              });
              if (i === length - 1) {
                missedShoots.push({
                  x: direction ? position.x - 1 : position.x - 1,
                  y: direction ? position.y - 1 : position.y - 1,
                });
                missedShoots.push({
                  x: direction ? position.x : position.x - 1,
                  y: direction ? position.y - 1 : position.y,
                });
                missedShoots.push({
                  x: direction ? position.x + 1 : position.x - 1,
                  y: direction ? position.y - 1 : position.y + 1,
                });
                missedShoots.push({
                  x: direction ? position.x - 1 : position.x + length,
                  y: direction ? position.y + length : position.y - 1,
                });
                missedShoots.push({
                  x: direction ? position.x : position.x + length,
                  y: direction ? position.y + length : position.y,
                });
                missedShoots.push({
                  x: direction ? position.x + 1 : position.x + length,
                  y: direction ? position.y + length : position.y + 1,
                });
              }
            }

            missedShoots = missedShoots.filter(({ x, y }) => x >= 0 && y <= 9 && y >= 0 && x <= 9);

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

            for (let i = 0; i < missedShoots.length; i++) {
              game.forEach(({ ws }: GameData) => {
                ws.send(
                  JSON.stringify({
                    type: MessageTypeEnum.ATTACK,
                    data: JSON.stringify({
                      position: {
                        x: missedShoots[i].x,
                        y: missedShoots[i].y,
                      },
                      currentPlayer: indexPlayer,
                      status: AttackStatus.MISS,
                    }),
                    id: 0,
                  }),
                );
              });
            }

            game.forEach(({ ws }: GameData, index: number) => {
              if (game[indexPlayer].killedShips >= 10) {
                ws.send(
                  JSON.stringify({
                    type: MessageTypeEnum.FINISH,
                    data: JSON.stringify({
                      winPlayer: indexPlayer,
                    }),
                    id: 0,
                  }),
                );
                if (index === indexPlayer && !winners.get(ws)) {
                  winners.set(ws, {
                    name: players.get(ws)?.name || '',
                    wins: 1,
                  });
                } else if (index === indexPlayer && winners.get(ws)) {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  winners.get(ws)!.wins += 1;
                }
                updateWinners();
              }
            });

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
        sendTurnMessage(gameId, indexPlayer === 0 && !isShoot ? 1 : 0);
      });
    }
  }
}

export function handleRandomAttack({ gameId, indexPlayer }: RandomAttackMessageData): void {
  const game = games.get(gameId);
  if (game) {
    const attackPositions = game[indexPlayer].attackPositions;
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    handleAttack({ x, y, gameId, indexPlayer });
  }
}
