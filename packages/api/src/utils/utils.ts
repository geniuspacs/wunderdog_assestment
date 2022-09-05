import { MovementEnum, RoundMovement } from "rock_types";

export const determineWinner = (movements: RoundMovement[]): string => {

    const player1 = movements[0];
    const player2 = movements[1];

    let winner: string = '';

    if (player1.movement === MovementEnum.ROCK) { // P1 - ROCK
        switch (player2.movement) {
            case MovementEnum.PAPER:
                winner = player2.player;
                break;
            case MovementEnum.SCISSORS:
                winner = player1.player;
                break;
        }
    } else if (player1.movement === MovementEnum.PAPER) { // P1 - PAPER
        switch (player2.movement) {
            case MovementEnum.ROCK:
                winner = player1.player;
                break;
            case MovementEnum.SCISSORS:
                winner = player2.player;
                break;
        }
    } else { // P1 - SCISSORS
        switch (player2.movement) {
            case MovementEnum.ROCK:
                winner = player2.player;
                break;
            case MovementEnum.PAPER:
                winner = player1.player;
                break;
        }
    }

    return winner;

}