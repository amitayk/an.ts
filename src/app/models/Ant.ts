import { Coordinates } from "./Coordinates";
import { Action as Action } from "./Action";
import { ActionResult } from "./ActionResult";
import { GameSquare } from "./GameSquare";

export class Ant {

    readonly id: string;

    coordinates: Coordinates;

    memory: {
        bool1: Boolean,
        bool2: Boolean,
        smallNubmer: 0 | 1 | 2 | 3 | 4 | 5
    }

    private _lastMoves?: Coordinates[] = [];

    public get lastMoves(): Coordinates[] {
        return this._lastMoves;
    }
    // Limit last moves to 20.
    public set lastMoves(move: Coordinates[]) {
        if (move.length > 19) {
            move = move.slice(1, 19);
        }
        this._lastMoves = move;
    }

    nextAction?: Action;

    lastActionResult?: ActionResult;

    food?: string;

    color: string;

    surroundings: GameSquare[] = [];

    constructor(x: number, y: number) {
        this.coordinates = { x, y };
    }

}