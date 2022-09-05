import { RoundMovement } from "./RoundMovement";

export interface RoundResult {
    roundId: number;
    movements: RoundMovement[];
    winner: string;
}