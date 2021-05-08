import { Coordinates } from "./Coordinates";
import { Action as Action } from "./Action";
import { ActionResult } from "./ActionResult";
import { GameSquare } from "./GameSquare";

export class Ant {

    id: string;

    coordinates: Coordinates;

    private _lastMoves?: Coordinates[] = [];

    // Limit last moves to 20.
    public get lastMoves(): Coordinates[] {
        return this._lastMoves;
    }
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