import { Component } from '@angular/core';
import { RandomBotService } from './bots/random-bot.service';
import { SimpleBotService } from './bots/simple-bot.service';
import { CentralService } from './game/central.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ants';

  constructor(private centralService: CentralService,
    private simpleBotService: SimpleBotService,
    private randomBotService: RandomBotService,

  ) {
  }

}
