import { Injectable } from '@angular/core';
import { CentralService } from '../game/central.service';
import { Action, ActionOption } from '../models/Action';
import { Ant } from '../models/Ant';
import { Coordinates } from '../models/Coordinates';
import { UserTick } from '../models/UserTIck';

@Injectable({
  providedIn: 'root'
})
export class RandomBotService {

  userName: string = "random bot";

  //#region Deafult bot boiler plate.
  constructor(private centralService: CentralService) {
    setTimeout(() => {
      this.initPlayer();
    }, 20);
  }

  initPlayer() {
    this.centralService.register({ userName: this.userName })
      .subscribe(tick => {
        this.act(tick);
      })
  }

  act(tick: UserTick) {

    // let myColony = tick.colony;
    let myAnts = tick.ants;
    let boardSize = tick.boardSize;

    myAnts.forEach(ant => {

      if (!ant.surroundings.length) return

      ant.nextAction = this.antAction(ant, boardSize);
    })

    this.centralService.actionInput.next({ userName: this.userName, ants: myAnts })
  }
  //#endregion default bot boiler plate.

  antAction(ant: Ant, boardSize: Coordinates): Action {

    let type: ActionOption;
    let nextMove: Coordinates;

    // 0 bring food to colony
    if (ant.food?.length) {

      let colony = ant.surroundings.find(s => s.colony?.player == this.userName);

      // If colony found, drop food to colony.
      if (colony) {
        type = 'DropFood';
        nextMove = colony.coordinates;
        // Serch for colony!
      } else {
        type = "Move";
        nextMove = ant.surroundings[Math.floor(Math.random() * ant.surroundings.length)].coordinates
      }
    } else {

      // 1 pick food
      let foodPileSquare = ant.surroundings.find(s => s.foodPile);
      if (foodPileSquare) {
        type = 'PickFood';
        nextMove = foodPileSquare.coordinates;
      }

      // 2 move
      else {
        type = "Move";
        nextMove = ant.surroundings[Math.floor(Math.random() * ant.surroundings.length)].coordinates
      }
    }

    return {
      type: type,
      nextSquare: nextMove
    };
  }

}
