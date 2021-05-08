import { Component, OnInit } from '@angular/core';
import { GameSquare } from 'src/app/models/GameSquare';
import { CentralService } from '../central.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  gameBoard: GameSquare[][];

  constructor(private centralService: CentralService) { }

  ngOnInit() {
    this.displayBoardEachTick();
  }

  displayBoardEachTick() {
    this.centralService.gameBoard$.subscribe(gameBoard => {
      if (!gameBoard) return;
      this.gameBoard = gameBoard;
    })

  }

}
