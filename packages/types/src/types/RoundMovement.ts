export enum MovementEnum {
    ROCK = 'R',
    PAPER = 'P',
    SCISSORS = 'S',
};

export type MovementType = 'R' | 'P' | 'S';

export interface RoundMovement {
    player: string;
    movement: MovementType;
}