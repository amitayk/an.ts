import { Ant } from "./Ant";
import { Colony } from "./Colony";
import { Coordinates } from "./Coordinates";

export interface UserTick {
    ants: Ant[],
    // colony: Colony,
    boardSize: Coordinates
}