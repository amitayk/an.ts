import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { Ant } from '../models/Ant';
import { Colony } from '../models/Colony';
import { ColorsEnum } from '../models/ColorsEnum';
import { Coordinates } from '../models/Coordinates';
import { FoodPile } from '../models/FoodPile';
import { GameSquare } from '../models/GameSquare';
import { PlayerRegistration } from '../models/PlayerRegistration';
import { UserTick } from '../models/UserTIck';
import { MechanichsService } from './mechanichs.service';

@Injectable({
  providedIn: 'root'
})
export class CentralService {

  //#region config
  private numberOfPlayers = 1;
  private width = 50;
  private height = 50;
  private foodPilesSize = 10;
  private numberOfFoodPiles = 30;
  private addAntsInTicks = [10, 20, 30, 40, 50];
  //#endregion config

  private grains: string[] = [];

  private secret: string;

  private tickNumber = 0;

  private players: { player: PlayerRegistration, clock: Subject<UserTick> }[] = [];


  /** Input for users actions. */
  public actionInput: Subject<{ userName: string, ants: Ant[] }>
    = new Subject<{ userName: string, ants: Ant[] }>();

  /** All the colonies of all the bots. */
  private colonies: Colony[] = [];

  readonly gameBoard$: Subject<GameSquare[][]> = new Subject<GameSquare[][]>();

  private tickActions: any[] = [];

  constructor(private mechanichsService: MechanichsService) {
    // Generate session secret.
    this.secret = Math.random().toString(36).substring(7) + Math.random().toString(36).substr(2, 5);
    this.mechanichsService.secret = this.secret;

    this.mechanichsService.foodArrivedAtColony$.subscribe(foodEvent => {
      console.log("Food arrived! at: " + foodEvent.colony.player + " colony!");

    })
  }

  /** Public function used to register the bots. */
  public register(playerRegistration: PlayerRegistration): Subject<UserTick> {

    let playerRef =
    {
      player: playerRegistration,
      clock: new Subject<UserTick>()
    };

    this.players.push(playerRef);

    if (this.players.length == this.numberOfPlayers) {
      this.startGame();
    }

    return playerRef.clock;
  }

  private startGame() {
    this.initBoard();

    this.initBotsListener();

    setTimeout(() => {
      this.tick();
    }, 500);
  }

  /** Listents to the bots. */
  initBotsListener() {
    this.actionInput.subscribe(userAction => {

      // No double moves.
      if (this.tickActions.some(ta => ta.userName == userAction.userName)) return;

      // Add the action.
      this.tickActions.push(userAction);

      // When all players submited their actions
      if (this.tickActions.length == this.numberOfPlayers) {

        // Tick each bot.
        this.tickActions.forEach(tickAction => {
          let ants = this.mechanichsService.tickABot(tickAction.ants, tickAction.userName);
          this.colonies.find(c => c.player == tickAction.userName).ants = ants;
        })

        this.colonies.forEach(colony => {
          colony.ants.forEach(ant => {
            ant.surroundings = this.mechanichsService.populateSurroundings(ant);
          })
        })

        this.tickActions = [];

        this.gameBoard$.next(this.mechanichsService.gameBoard);

        // Call for next move.
        setTimeout(() => {
          this.tick()
        }, 300);

      }
    })
  }

  private initBoard() {
    let gameBoard: GameSquare[][] = [];

    for (let x = 0; x < this.width; x++) {
      gameBoard.push([]);
      for (let y = 0; y < this.width; y++) {
        gameBoard[x].push(new GameSquare())
      }
    }

    for (let i = 0; i < this.numberOfFoodPiles; i++) {
      let foodPile = this.createFoodPile()
      let { x, y } = this.findEmptySquare(gameBoard);
      gameBoard[x][y].foodPile = foodPile;
    }


    this.players.forEach((player, i) => {

      // Find place for colony.
      let colony: Colony;
      let { x, y } = this.findEmptySquare(gameBoard);

      // Create colony,
      colony = {
        coordinates: {
          x: x,
          y: y,
        },
        // Create with single ant.
        ants: [],
        pile: [],
        player: player.player.userName,
        color: ColorsEnum[i]
      };

      colony.ants.push(this.createAntFromColony(colony))

      this.colonies.push(colony);
      gameBoard[x][y].colony = colony;

    })

    this.mechanichsService.gameBoard = gameBoard;

    setTimeout(() => {
      this.gameBoard$.next(gameBoard);
    }, 20);

  }

  private tick() {

    this.players.forEach(pc => {
      pc.clock.next({
        ants: this.colonies.find(c => c.player == pc.player.userName).ants,
        boardSize: { x: this.width, y: this.height }
      })
    })

    this.addAnts();

    this.tickNumber++;
  }

  private addAnts() {
    if (this.addAntsInTicks.includes(this.tickNumber)) {
      this.colonies.forEach(colony => {
        colony.ants.push(this.createAntFromColony(colony))
      })
    }
  }

  private createAntFromColony(colony: Colony): Ant {

    return {
      coordinates: colony.coordinates,
      id: colony.player + "_" + colony.ants.length,
      lastMoves: [],
      color: colony.color.antsColor,
      surroundings: []
    }
  }

  private createFoodPile(): FoodPile {
    return new FoodPile(this.foodPilesSize, this.secret, this);
  }

  public registerGrain(secret: string, grain: string) {
    if (secret != this.secret) return;
    this.grains.push(grain);
  }

  private findEmptySquare(gameBoard): Coordinates {
    while (true) {
      let x = Math.round(Math.abs(Math.random() * (this.width - 1)));
      let y = Math.round(Math.abs(Math.random() * (this.height - 1)));
      if (!gameBoard[x][y].colony && !gameBoard[x][y].foodPile) {
        return { x, y }
      }
    }
  }
}