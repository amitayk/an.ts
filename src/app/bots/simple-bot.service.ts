import { Injectable } from '@angular/core';
import { CentralService } from '../game/central.service';
import { Action, ActionOption } from '../models/Action';
import { Ant } from '../models/Ant';
import { Coordinates } from '../models/Coordinates';
import { UserTick } from '../models/UserTIck';

@Injectable({
  providedIn: 'root'
})
export class SimpleBotService {

  readonly userName: string = "amyu98";

  readonly botConfig = {
    numberToDirection: {

      0: ((coords: Coordinates) => {
        return { x: coords.x + 1, y: coords.y + 1 }
      }),
      1: ((coords: Coordinates) => {
        return { x: coords.x - 1, y: coords.y - 1 }
      }),
      2: ((coords: Coordinates) => {
        return { x: coords.x - 1, y: coords.y + 1 }
      }),
      3: ((coords: Coordinates) => {
        return { x: coords.x + 1, y: coords.y - 1 }
      }),
      4: ((coords: Coordinates) => {
        return { x: coords.x, y: coords.y + 1 }
      }),
      5: ((coords: Coordinates) => {
        return { x: coords.x, y: coords.y - 1 }
      }),
      6: ((coords: Coordinates) => {
        return { x: coords.x + 1, y: coords.y }
      }),
      7: ((coords: Coordinates) => {
        return { x: coords.x - 1, y: coords.y }
      })

    }
  }

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

    // Bool 1 = is not to follow my own steps back?

    let type: ActionOption;
    let nextMoveSquare: Coordinates;

    let antIndex = +ant.id.split('_')[1];
    let antFuncIndex = +ant.id.split('_')[1] + ant.memory.smallNubmer;

    // Define basic movement funcs.

    let funcsArray = Object.values(this.botConfig.numberToDirection);

    // Main move func.
    let directionMainFunc =
      funcsArray[(antFuncIndex % funcsArray.length + funcsArray.length) % funcsArray.length]

    // Opposite move func. 
    let directionOppFunc;

    // Find opposite move func.
    if (antIndex % 2 == 0) {
      directionOppFunc = funcsArray[antIndex + 1];
    } else {
      directionOppFunc = funcsArray[antIndex - 1];
    };

    // 0 bring food to colony
    if (ant.food?.length) {

      let colony = ant.surroundings.find(s => s.colony?.player == this.userName);

      // If colony found, drop food to colony.
      if (colony) {
        type = 'DropFood';
        nextMoveSquare = colony.coordinates;
      }

      // Search for colony!
      else {
        // Move to:
        type = "Move";

        nextMoveSquare = findMove(true, this.centralService.width, this.centralService.height);


        // Circular manner, not relevant.
        // let directionOppFunc = funcsArray[(+ant.id.split('_')[1] + 1 % funcsArray.length + funcsArray.length) % funcsArray.length]


        // Find lastest move.
        // let lastMoveSqaure = ant.lastMoves.pop();

        // // If memory is relevent, use memory
        // if (!ant.memory.bool1 && lastMoveSqaure) {
        //   nextMoveSquare = lastMoveSqaure;

        //   // If memory is empty, or I should avoid memory 
        // } else {
        //   nextMoveSquare = ant.surroundings[Math.floor(Math.random() * ant.surroundings.length)].coordinates
        // }
      }


    } else {

      ant.memory.bool1 = false;

      // 1 pick food
      let foodPileSquare = ant.surroundings.find(s => s.foodPile);
      if (foodPileSquare) {
        type = 'PickFood';
        nextMoveSquare = foodPileSquare.coordinates;
      }

      // 2 move
      else {
        type = "Move";
        nextMoveSquare = findMove(false, this.centralService.width, this.centralService.height);
        // nextMoveSquare = ant.surroundings[Math.floor(Math.random() * ant.surroundings.length)].coordinates
      }
    }

    return {
      type: type,
      nextSquare: nextMoveSquare
    };

    function findMove(directionFlag: boolean, gameWidth: number, gameHeight: number) {

      let nextMoveSquareTemp;
      if (directionFlag) {
        nextMoveSquareTemp = directionMainFunc(ant.coordinates);
      } else {
        nextMoveSquareTemp = directionOppFunc(ant.coordinates);
      }

      if (nextMoveSquareTemp.x < 0 || nextMoveSquareTemp.x > gameWidth - 1 ||
        nextMoveSquareTemp.y < 0 || nextMoveSquareTemp.y > gameHeight - 1) {

        let nextMoveFunc = funcsArray[antIndex + ant.memory.smallNubmer];
        if (nextMoveFunc) {
          nextMoveSquareTemp = nextMoveFunc(ant.coordinates);
        } else {
          ant.memory.smallNubmer = 0;
          nextMoveFunc = funcsArray[0];
          nextMoveSquareTemp = nextMoveFunc(ant.coordinates);
        }
        try {
          ant.memory.smallNubmer += 3;
        } catch (error) {
          ant.memory.smallNubmer = 0
        }
      }

      return nextMoveSquareTemp;
    }
  }

}
