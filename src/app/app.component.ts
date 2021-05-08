import { Component } from '@angular/core';
import { AmitaysBotService } from './bots/amitays-bot.service';
import { CentralService } from './game/central.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ants';

  constructor(private centralService: CentralService,
    private amitaysBotService: AmitaysBotService
  ) {
  }

}
