import { Ant } from "./Ant";
import { Coordinates } from "./Coordinates";

export class Colony {

    player: string;

    ants: Ant[];

    coordinates: Coordinates;

    pile: string[];

    color: { colonyColor: string, antsColor: string };

    constructor(x: number, y: number) {
        this.coordinates = { x, y };
    }

}