import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ant } from '../models/Ant';
import { Colony } from '../models/Colony';
import { Coordinates } from '../models/Coordinates';
import { GameSquare } from '../models/GameSquare';

@Injectable({
  providedIn: 'root'
})
export class MechanichsService {

  private _secret: string;

  public set secret(v: string) {
    if (this._secret) return;
    this._secret = v;
  }

  public foodArrivedAtColony$: Subject<{ food: string, colony: Colony, secret: string }> =
    new Subject<{ food: string, colony: Colony, secret: string }>();

  constructor() { }

  /** The game board. */
  public gameBoard: GameSquare[][];

  /** Tick bot's ants. */
  public tickABot(ants: Ant[], botName: string): Ant[] {

    this.validateAntsCredibility(botName, ants);

    ants.forEach(ant => {

      ant = this.preformActionOnAnt(ant);

    })

    return ants;
  }

  /** Validates user didnt manipulated the ants. */
  private validateAntsCredibility(botName: string, ants: Ant[]) {
    // TODO Credibility Test!
  }

  private preformActionOnAnt(ant: Ant) {

    if (!ant.nextAction) return ant;

    switch (ant.nextAction.type) {
      case "Stay": {
        break;
      }
      case "Move": {
        // Validate ant's move is possible.
        if (!this.validateMove(ant)) break;

        // Move ant.
        this.moveAnt(ant);

        // Finish 
        ant.lastActionResult = { trophy: null, action: ant.nextAction };
        break;
      }
      case "PickFood": {
        // TODO food is now duplicateable and stealable!
        let food = this.tryToPickFood(ant);
        ant.food = food;
        break;
      }
      case "DropFood": {
        // TODO
        let succsses = this.tryToDropFood(ant);
        if (succsses) {
          ant.food = null;
        }
        break;
      }

      default:
        break;
    }
    return ant;
  }

  private moveAnt(ant: Ant) {
    this.gameBoard[ant.coordinates.x][ant.coordinates.y].ant = null;
    ant.coordinates = ant.nextAction.nextSquare;
    this.gameBoard[ant.nextAction.nextSquare.x][ant.nextAction.nextSquare.y].ant = ant;
  }

  private validateMove(ant: Ant) {
    let currentSquare = ant.coordinates;
    let nextSquare = ant.nextAction.nextSquare;

    if (!nextSquare || !currentSquare) return false;

    // If step bigger than 1.
    if (
      Math.abs(nextSquare.x - currentSquare.x) > 1 ||
      Math.abs(nextSquare.y - currentSquare.y) > 1
    ) {
      return false;
    }

    // If step is out of bounds.
    if (this.isCoordsOutOfArray(nextSquare, this.gameBoard)) {
      return false;
    }

    // TODO need valdaite not stepping on other ant!

    return true;
  }


  private isCoordsOutOfArray(coordinates: Coordinates, array: any[][]): Boolean {
    return (coordinates.x < 0 || coordinates.x > array.length - 1 ||
      coordinates.y < 0 || coordinates.y > array[0].length - 1)
  }

  public populateSurroundings(ant: Ant): GameSquare[] {
    let surroundings = this.getSurroundingsCoords(ant.coordinates);
    surroundings = this.filterOutofbounds(surroundings);
    return surroundings.map(s => {
      let r = this.gameBoard[s.x][s.y];
      r.coordinates = { x: s.x, y: s.y };
      return r;
    }
    );
  }

  private getSurroundingsCoords(coords: Coordinates) {
    let { x, y } = coords;
    return [{ x: x - 1, y: y - 1 }, { x: x, y: y - 1 }, { x: x + 1, y: y - 1 },
    { x: x - 1, y }, { x: x + 1, y },
    { x: x - 1, y: y + 1 }, { x: x, y: y + 1 }, { x: x + 1, y: y + 1 }];
  }

  filterOutofbounds(surroundings: Coordinates[]): Coordinates[] {
    return surroundings.filter(s => s.x > -1 && s.y > -1 && s.x < this.gameBoard.length && s.y < this.gameBoard[0].length);
  }

  private tryToPickFood(ant: Ant): string {

    if (ant.food) return;

    let square = this.gameBoard[ant.nextAction.nextSquare.x]?.[ant.nextAction.nextSquare.y]

    if (!square) return;

    let foodPile = square?.foodPile;

    if (!foodPile) return;

    let grainAndData = foodPile.getGrain(this._secret);

    if (grainAndData.grainsLeft == 0) {
      square.foodPile = null;
    }

    return grainAndData.grain;
  }

  private tryToDropFood(ant: Ant) {

    if (!ant.food) return;

    let square = this.gameBoard[ant.nextAction.nextSquare.x]?.[ant.nextAction.nextSquare.y];

    if (square) {

      if (square.colony) {
        this.foodArrivedAtColony$.next({
          colony: square.colony,
          food: ant.food,
          secret: this._secret
        })
      } else {
        this.gameBoard[square.coordinates.x][square.coordinates.y].food = ant.food;
      }

      return true;
    }

  }
}
