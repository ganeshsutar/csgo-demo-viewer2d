import { Component, OnInit, ViewChild } from '@angular/core';
import { DemoViewerCanvasComponent } from 'src/app/components/demo-viewer-canvas/demo-viewer-canvas.component';
import { MarkerData } from 'src/app/components/timeline-slider/timeline-slider.component';
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
    bombPlantTick: 0,
    roundEndTick: 0,
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
  public markers: MarkerData[] = [
    {tick: 0, text: 'start'}
  ];

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

  get rounds() {
    return this.matchInfo.roundInfo.map((r, i) => i);
  }

  loadMatchInfo(matchInfo): void {
    this.matchInfo = matchInfo;
    this.round = 0;
    this.demoLoaded = true;
    return this.loadRoundInfo();
  }

  onRoundChanged() {
    this.stopPlaying();
    this.loadRoundInfo();
  }

  onZoomReset() {
    this.viewer.onZoomReset();
  }

  updatePlayerInfo() {
    this.roundInfo.tClan.players.map((item, index) => {
      this.matchInfo.playerInfo[item].team = 2;
      this.matchInfo.playerInfo[item].no = index;
    });
    this.roundInfo.ctClan.players.map((item, index) => {
      this.matchInfo.playerInfo[item].team = 3;
      this.matchInfo.playerInfo[item].no = index+5;
    });
  }

  loadRoundInfo() {
    this.roundInfo = this.matchInfo.roundInfo[this.round];
    this.roundLoading = true;
    this.roundLoaded = false;
    this.updatePlayerInfo();

    return this.demoPlayer.loadJson(this.baseDir + '/' + this.roundInfo.gameStateFile).then((states) => {
      this.roundLoading = false;
      this.roundLoaded = true;
      this.gameStates = states;
      this.currentIndex = 0;
      this.resetSlider();
    });
  }

  loadGame(): void {
    this.baseDir = 'F:\\demo-maps\\generated\\demo-files';
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
    this.addMarkers();
  }

  addMarkers() {
    this.markers = [];

    this.markers.push({
      tick: 0, text: 'Start'
    });
    this.markers.push({
      tick: this.gameStates.length-1, text: 'End'
    })
    let freezeAdded = false;
    let bombPlantAdded = false;
    let winnerAdded = false;

    for(var i=0; i<this.gameStates.length; ++i) {
      let gameState = this.gameStates[i];
      if(!freezeAdded && gameState.tick > this.roundInfo.freezeEndTick) {
        this.markers.push({
          tick: i, text: 'Go Go Go'
        });
        freezeAdded = true;
      }
      if(this.roundInfo.bombPlantTick != 0 && !bombPlantAdded && 
        gameState.tick > this.roundInfo.bombPlantTick) {
        this.markers.push({
          tick:i, text: 'Bomb Planted'
        });
        bombPlantAdded = true;
      }
      if(!winnerAdded && gameState.tick > this.roundInfo.roundEndTick) {
        this.markers.push({
          tick: i, text: (this.roundInfo.winner == 2 ? 'T Won': 'CT Won')
        });
        winnerAdded = true;
      }

      if(freezeAdded &&  bombPlantAdded && winnerAdded) break;
    }
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
    const sorter = (a, b) => {
      return this.matchInfo.playerInfo[a.userId].no - this.matchInfo.playerInfo[b.userId].no;
    };
    let keys = this.roundInfo.tClan.players;
    console.log(keys, this.matchInfo.playerInfo);
    let players = this.CurrentGameState.players.filter((player) => {
      return keys.includes(player.userId);
    }).map((player, index) => {
      return Object.assign({}, player, {team: 2});
    });
    players.sort(sorter);
    return players;
  }

  get CTPlayers(): any[] {
    const sorter = (a, b) => {
      return this.matchInfo.playerInfo[a.userId].no - this.matchInfo.playerInfo[b.userId].no;
    };
    let keys = this.roundInfo.ctClan.players;
    console.log(keys, this.matchInfo.playerInfo);
    let players = this.CurrentGameState.players.filter((player) => {
      return keys.includes(player.userId);
    }).map((player, index) => {
      return Object.assign({}, player, {team: 3});
    });
    players.sort(sorter)
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
    console.log(userId, this.matchInfo.playerInfo[userId]);
    return this.matchInfo.playerInfo[userId];
  }

}
