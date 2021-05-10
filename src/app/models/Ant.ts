import { Coordinates } from "./Coordinates";
import { Action as Action } from "./Action";
import { ActionResult } from "./ActionResult";
import { GameSquare } from "./GameSquare";

export class Ant {

    readonly id: string;

    coordinates: Coordinates;

    //#region Memory
    private _bool1?: boolean;
    public get bool1(): boolean {
        return this._bool1;
    }
    public set bool1(v: boolean) {
        if (v === true || v === false) {
            this._bool1 = v;
        }
    }

    private _bool2?: boolean;
    public get bool2(): boolean {
        return this._bool2;
    }
    public set bool2(v: boolean) {
        if (v === true || v === false) {
            this._bool2 = v;
        }
    }

    private _smallNumber?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    public get smallNumber(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 {
        return this._smallNumber;
    }
    public set smallNumber(v: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) {
        if (![0, 1, 2, 3, 4, 5].includes(v)) return
        this._smallNumber = v;
    }
    //#endregion Memory

    // TODO restrict all values for runtime..

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

    constructor(colony, surroundings) {
        this.coordinates = colony.coordinates;
        this.id = colony.player + "_" + colony.ants.length;
        this.lastMoves = [];
        this.color = colony.color.antsColor;
        this.surroundings = [];
        this._smallNumber = 0;
        this.surroundings = surroundings;
    }

}