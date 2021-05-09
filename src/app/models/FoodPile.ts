import { CentralService } from "../game/central.service";

export class FoodPile {

    foodPileSize: number;

    private grainsOfFood: string[] = [];

    private secret: string;

    constructor(foodPileSize: number, secret: string,
        private centralService: CentralService) {

        this.secret = secret;

        this.foodPileSize = foodPileSize;

        for (let i = 0; i < foodPileSize; i++) {

            let grain =
                Math.random().toString(36).substring(7) + Math.random().toString(36).substr(2, 5);

            this.grainsOfFood.push(grain);
            this.centralService.registerGrain(secret, grain);

            this.grainsOfFood.push(
            );

        }
    }

    public getGrain(secret: string) {
        if (secret != this.secret) return;
        let grain = this.grainsOfFood.pop();
        return { grain: grain, grainsLeft: this.grainsOfFood.length };
    }
}