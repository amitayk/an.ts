import { Ant } from "./Ant";
import { Colony } from "./Colony";
import { Coordinates } from "./Coordinates";
import { FoodPile } from "./FoodPile";

export class GameSquare {

    ant?: Ant;
    food: string;
    colony?: Colony;
    foodPile: FoodPile;
    coordinates: Coordinates;

    public get display(): string {
        if (this.colony) return "colony";
        if (this.foodPile) return "foodPile";
        if (this.ant) return "ant";
        return "none";
    }

    constructor() {
    }
}