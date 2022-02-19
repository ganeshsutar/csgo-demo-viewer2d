import { Component, Input, OnInit } from '@angular/core';

const matchLength = 1 * 60 + 55;

@Component({
  selector: 'app-map-header-info',
  templateUrl: './map-header-info.component.html',
  styleUrls: ['./map-header-info.component.scss']
})
export class MapHeaderInfoComponent implements OnInit {
  @Input() public round: number = 0;
  @Input() public matchInfo: any = {};
  @Input() public roundInfo: any = {};
  @Input() public currentGameState: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  get currentState(): string {
    if(!this.currentGameState.tick) return 'freeze-time';
    if(!this.roundInfo.startTick || !this.roundInfo.endTick || !this.roundInfo.freezeEndTick) return 'freeze-time';
    
    const currentTick = this.currentGameState.tick;
    if(currentTick < this.roundInfo.freezeEndTick) {
      return 'freeze-time';
    } else {
      if(currentTick > this.roundInfo.bombPlantTick) {
        return 'bomb-planted';
      } else {
        return 'playing';
      }
    }
  }

  get currentTime(): string {
    if(!this.currentGameState.tick) return '-:--';

    const currentTick = this.currentGameState.tick;
    if(currentTick < this.roundInfo.freezeEndTick) {
      let seconds = Math.abs((currentTick - this.roundInfo.freezeEndTick) / this.matchInfo.tickRate);
      let mins = (seconds/60).toFixed();
      let secs = ('0' + (seconds%60).toFixed());
      secs = secs.substring(secs.length-2);
      return `${mins}:${secs}`;
    } else {
      let seconds = matchLength - Math.abs((currentTick - this.roundInfo.freezeEndTick) / this.matchInfo.tickRate);
      if(currentTick > this.roundInfo.bombPlantTick) {
        seconds = 40 - Math.abs((currentTick - this.roundInfo.bombPlantTick) / this.matchInfo.tickRate);
      }
      let mins = Math.floor(seconds/60);
      let secs = ('0' + (seconds%60).toFixed());
      secs = secs.substring(secs.length-2);
      return `${mins}:${secs}`;

    }
  }

}
