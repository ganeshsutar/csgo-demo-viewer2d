import { Component, OnInit, ViewChild } from '@angular/core';
import { DemoViewerCanvasComponent } from 'src/app/components/demo-viewer-canvas/demo-viewer-canvas.component';
import { DemoPlayerService } from 'src/app/services/demo-player.service';


@Component({
  selector: 'app-demo-viewer',
  templateUrl: './demo-viewer.component.html',
  styleUrls: ['./demo-viewer.component.scss'],
  host: {
    class: 'demoviewer'
  }
})
export class DemoViewerComponent implements OnInit {
  @ViewChild(DemoViewerCanvasComponent)
  private viewer: DemoViewerCanvasComponent;
  
  public demoLoaded = false;
  public roundLoading = false;
  public roundLoaded = false;

  private baseDir: string = '';
  private matchInfo = {
    mapName: '',
    serverName: '',
    playerInfo: {},
    roundInfo: []
  };
  public round = 0;
  private roundInfo = {
    startTick: 0,
    endTick: 0,
    freezeEndTick: 0,
    reason: '',
    winner: 2,
    gameStateFile: '',
    tClan: {
      clanName: '',
      team: 'T',
      players: []
    },
    ctClan: {
      clanName: '',
      team: 'CT',
      players: []
    }
  };
  private gameStates: any[] = [];
  public currentIndex: number = 0;

  public intervalId;

  public slider: any = {
    min: 0,
    max: 0,
    step: 1
  };

  constructor(private demoPlayer: DemoPlayerService) { }

  ngOnInit(): void {
    // this.loadGameState();
    this.loadGame();
  }

  loadMatchInfo(matchInfo): void {
    this.matchInfo = matchInfo;
    this.round = 0;
    this.demoLoaded = true;
    return this.loadRoundInfo();
  }

  onZoomReset() {
    this.viewer.onZoomReset();
  }

  loadRoundInfo() {
    this.roundInfo = this.matchInfo.roundInfo[this.round];
    this.roundLoading = true;
    this.roundLoaded = false;

    return this.demoPlayer.loadJson(this.baseDir + '/' + this.roundInfo.gameStateFile).then((states) => {
      this.roundLoading = false;
      this.roundLoaded = true;
      this.gameStates = states;
      this.currentIndex = 0;
      this.resetSlider();
    });
  }

  loadGame(): void {
    this.baseDir = 'C:\\Users\\jack\\Documents\\projects\\csgo-demo-test\\generated\\demo-files';
    this.demoPlayer.loadJson(this.baseDir + '\\match-info.json.gzip').then((matchInfo) => {
      return this.loadMatchInfo(matchInfo);
    });
  }

  onPlayPause() {
    if(this.intervalId != null) {
      this.stopPlaying();
    } else {
      this.startPlaying();
    }
  }

  resetSlider() {
    this.slider.min = 0;
    this.slider.max = this.gameStates.length;
  }

  onNextRound(stopPlaying=true) {
    if(stopPlaying) this.stopPlaying();
    let maxRounds = this.matchInfo.roundInfo.length;
    if(this.round < maxRounds-1) {
      ++this.round;
      this.currentIndex = 0;
    }
    return this.loadRoundInfo();
  }

  onPreviousRound(stopPlaying=true) {
    if(stopPlaying) this.stopPlaying();
    if(this.round > 0) {
      --this.round;
      this.currentIndex = 0;
    }
    return this.loadRoundInfo();
  }

  startPlaying() {
    this.intervalId = setInterval(() => {
      if(this.currentIndex >= this.gameStates.length) {
        this.onNextRound(false);
      }
      this.currentIndex += 1;
    }, 31.25);
  }

  stopPlaying() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = null;
  }

  get TPlayers(): any[] {
    let keys = this.roundInfo.tClan.players;
    let players = this.CurrentGameState.players.filter((player) => {
      return keys.includes(player.userId);
    }).map((player) => {
      return Object.assign({}, player, {team: 2});
    });
    return players;
  }

  get CTPlayers(): any[] {
    let keys = this.roundInfo.ctClan.players;
    let players = this.CurrentGameState.players.filter((player) => {
      return keys.includes(player.userId);
    }).map((player) => {
      return Object.assign({}, player, {team: 3});
    });
    return players;
  }

  get CurrentGameState(): any {
    if (this.gameStates.length == 0 || !(this.currentIndex >= 0 && this.currentIndex < this.gameStates.length)) {
      return {
        players: [],
        deaths: [],
        bomb:[]
      };
    }

    return this.gameStates[this.currentIndex];
  }

  getPlayerInfo(userId): any {
    return this.matchInfo.playerInfo[userId];
  }

}
