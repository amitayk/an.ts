import { Coordinates } from "./Coordinates";

export interface Action {
    type: ActionOption,
    nextSquare: Coordinates
}

export type ActionOption = "Move" | "Stay" | "PickFood" | "DropFood";