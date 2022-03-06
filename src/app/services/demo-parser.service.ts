import { Injectable } from '@angular/core';
import { CsgoDemoFileWriter } from '../parser/demo-helper';
import { BehaviorSubject } from 'rxjs';

declare var fsPromises: any;
declare var DemoFile: any;

const nadeModels = [
  'models/Weapons/w_eq_flashbang_dropped.mdl',
  'models/Weapons/w_eq_incendiarygrenade_dropped.mdl',
  'models/Weapons/w_eq_smokegrenade_thrown.mdl',
  'models/Weapons/w_eq_molotov_dropped.mdl',
  'models/Weapons/w_eq_fraggrenade_dropped.mdl'
];


const DEFAULT_ROUND_INFO = {
  startTick: 0,
  endTick: 0,
  freezeEndTick: 0,
  roundEndTick: 0,
  bombPlantTick: 0,
  reason: '',
  winner: 0,
  tClan: {
      clanName:'',
      team: 'T',
      players: []
  },
  ctClan: {
      clanName: '',
      team: 'CT',
      players: []
  },
  startScores: {},
  endScores: {},
};

@Injectable({
  providedIn: 'root'
})
export class DemoParserService {
  private demofile: any = null;
  private storage: CsgoDemoFileWriter = null;
  public progressText: BehaviorSubject<string> = new BehaviorSubject<string>('Parsing demo ...');
  public parsing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public parsingProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0.0); 
  
  private startTime: Date = null;
  private progressDone: number = 0.0;

  private matchInfo: any = {
    mapName: '',
    serverName: '',
    playerInfo: {},
    roundInfo: [],
    teams: []
  };
  private currentRoundInfo: any = JSON.parse(JSON.stringify(DEFAULT_ROUND_INFO));
  private currentRoundGameStates: any[] = [];
  private currentGameState: any = {
    players: [],
    deaths: [],
    bomb: {
      dropped: false,
      entindex: 0
    },
    bombPlanted: {
      planted:  false,
      x: 0,
      y: 0
    },
    nadesThrown: [],
    smokes: [],
    infernos: [],
    decoys: [],
    flashes: [],
    heGrenades: []
  };

  constructor() { }

  getWeapons(player: any) {
    return player.weapons.map((weapon: any) => {
      return {
        itemName: weapon.itemName,
        clipAmmo: weapon.clipAmmo,
        reserveAmmo: weapon.reserveAmmo,
        ownerAmmo: weapon.ownerAmmo
      };
    });
  }

  getPlayersStates() {
    return this.demofile.players.map((player) => {
      if (player.isHltv || player.isFakePlayer) return;
      if (!(player.teamNumber == 2 || player.teamNumber == 3)) return;

      return {
        userId: player.userId,
        x: player.position.x,
        y: player.position.y,
        yaw: player.eyeAngles.yaw,
        isAlive: player.isAlive,
        team: player?.team?.teamNumber,
        hasC4: player.hasC4,
        hasDefuser: player.hasDefuser,
        health: player.health,
        armor: player.armor,
        helmet: player.hasHelmet,
        weapon: player.weapon ? player.weapon?.itemName : '',
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        lifeState: player.lifeState,
        flashduration: player.flashDuration,
        weapons: this.getWeapons(player),
        account: player.account
      };
    }).filter((i: any) => i);
  }

  getNadesThrownStates() {
    return this.currentGameState.nadesThrown.map((e: any) => {
      return {
        index: e.index,
        modelName: e.modelName,
        x: e.entity.position.x,
        y: e.entity.position.y
      };
    });
  }

  removeFuseGrenades() {
    const interval = this.demofile.tickRate / 2;
    const removeNadeFilter = (interval_ticks: number) => {
      return (n: any) => {
        return ((this.demofile.currentTick - n.tick) < interval_ticks);
      };
    };
    this.currentGameState.flashes = this.currentGameState.flashes.filter(removeNadeFilter(interval));
    this.currentGameState.heGrenades = this.currentGameState.heGrenades.filter(removeNadeFilter(interval));
    this.currentGameState.decoys = this.currentGameState.decoys.filter(removeNadeFilter(15 * this.demofile.tickRate));
  }

  addGameState() {
    const getXY = (e: any) => {
      return { x: e.x, y: e.y };
    };
    let gameState: any = {
      tick: this.demofile.currentTick,
      players: this.getPlayersStates(),
      deaths: this.currentGameState.deaths.map((i: any) => i),
      bomb: [],
      bombPlanted: [],
      nades: this.getNadesThrownStates(),
      smokes: this.currentGameState.smokes.map(getXY),
      flashes: this.currentGameState.flashes.map(getXY),
      heGrenades: this.currentGameState.heGrenades.map(getXY),
      infernos: this.currentGameState.infernos.map(getXY),
      decoys: this.currentGameState.decoys.map(getXY)
    };

    if (this.currentGameState.bomb.dropped) {
      const entindex = this.currentGameState.bomb.entindex;
      const bombEntity = this.demofile.entities.entities.get(entindex) as any;
      if (bombEntity) {
        gameState.bomb = [{
          x: bombEntity.position.x,
          y: bombEntity.position.y
        }];
      }
    }

    if (this.currentGameState.bombPlanted.planted) {
      gameState.bombPlanted = [
        {
          x: this.currentGameState.bombPlanted.x,
          y: this.currentGameState.bombPlanted.y
        }
      ];
    }

    if (gameState.players.length != 0) {
      this.currentRoundGameStates.push(gameState);
    }

    this.removeFuseGrenades();
  }

  getTeamScores() {
    const tTeam = this.demofile.teams[2];
    const ctTeam = this.demofile.teams[3];

    return {
      'T': tTeam.score,
      'CT': ctTeam.score
    };
  }

  getTeamPlayers() {
    const tTeam = this.demofile.teams[2];
    const ctTeam = this.demofile.teams[3];
    return {
      'T': tTeam.members.map((player) => player.userId),
      'CT': ctTeam.members.map((player) => player.userId)
    };
  }

  onRoundStart(e: any) {
    // console.log('Round Started', this.demofile.currentTick, this.demofile.gameRules.roundsPlayed);
    this.sendMessage(`Parsing round [${this.demofile.gameRules.roundsPlayed}]`);
    this.currentRoundInfo.startTick = this.demofile.currentTick;
  }

  updateRoundPlayerInfo() {
    let players = this.getTeamPlayers();
    this.currentRoundInfo.tClan.players = players['T'];
    this.currentRoundInfo.ctClan.players = players['CT'];
  }

  onRoundEnd(e: any) {
    this.currentRoundInfo.reason = e.message;
    this.currentRoundInfo.winner = e.winner;
    this.currentRoundInfo.roundEndTick = this.demofile.currentTick;
    // console.log(e.message, e.winner, this.demofile.currentTick);
  }

  rollRound() {
    this.currentRoundInfo.endTick = this.demofile.currentTick;
    this.currentRoundInfo.endScores = this.getTeamScores();
    this.storage.saveRoundGameStates(this.currentRoundInfo, this.matchInfo.roundInfo.length, this.currentRoundGameStates);
    this.matchInfo.roundInfo.push(this.currentRoundInfo);
    // console.log('Total States:', this.currentRoundGameStates.length, this.demofile.currentTick);
    this.currentRoundInfo = JSON.parse(JSON.stringify(DEFAULT_ROUND_INFO));
    this.currentGameState = {
      tick: 0,
      players: [],
      deaths: [],
      nadesThrown: [],
      bomb: {},
      bombPlanted: {},
      smokes: [],
      infernos: [],
      decoys: [],
      flashes: [],
      heGrenades: []
    };
    this.currentRoundGameStates = [];
  }

  onRoundOfficiallyEnd(e: any) {
    this.rollRound();
  }

  onFreezeEnd(e: any) {
    this.currentRoundInfo.tClan.clanName = this.demofile.teams[2].clanName;
    this.currentRoundInfo.ctClan.clanName = this.demofile.teams[3].clanName;
    this.currentRoundInfo.startScores = this.getTeamScores();
    this.currentRoundInfo.freezeEndTick = this.demofile.currentTick;
    this.currentGameState.deaths = [];
    this.updateRoundPlayerInfo();
  }

  onBombDropped(e: any) {
    this.currentGameState.bomb.dropped = true;
    this.currentGameState.bomb.entindex = e.entindex;
  }

  onBombPickup(e: any) {
    this.currentGameState.bomb.dropped = false;
  }

  onPlayerDeath(e: any) {
    const player = this.demofile.entities.getByUserId(e.userid);
    this.currentGameState.deaths.push({
      userId: player?.userId,
      x: player?.position.x,
      y: player?.position.y
    });
  }

  onPlayerJoined(e: any) {
    if (!(e.entity instanceof DemoFile.Player)) {
      return;
    }

    this.matchInfo.playerInfo[e.entity.userId] = {
      userId: e.entity.userId,
      name: e.entity.name,
      clanName: e.entity.team?.clanName
    };

    // console.log('Player joined', e.entity.name);
  }

  onTeamJoined(e: any) {
    if (!(e.entity instanceof DemoFile.Team)) {
      return;
    }
    this.matchInfo.teams.push(e.entity.clanName || ('' + e.entity.index));
    // e.entity.members.forEach((player) => {
    //   console.log(`${e.entity.handle} - ${player.name}`);
    // });
  }

  onBombPlanted(e: any) {
    this.currentGameState.bombPlanted.planted = true;
    this.currentGameState.bombPlanted.x = e.player.position.x;
    this.currentGameState.bombPlanted.y = e.player.position.y;
    // console.log('Bomb Planted', this.currentGameState.bombPlanted);
    this.currentRoundInfo.bombPlantTick = this.demofile.currentTick;
  }

  onTickEnd(tick: number) {
    let frame = this.demofile.tickRate / 32;
    if ((tick % frame) != 0) return;

    this.addGameState();
  }

  onGrenadeAdded(e: any) {
    if (!("DT_BaseCSGrenadeProjectile" in e.entity.props)) return;

    const projectileEntity = e.entity;
    // const thrower = projectileEntity.owner as DemoFile.Player;

    if (nadeModels.includes(projectileEntity.modelName || '')) {
      this.currentGameState.nadesThrown.push({
        entity: projectileEntity,
        index: projectileEntity.index,
        modelName: projectileEntity.modelName,
        x: projectileEntity.position.x,
        y: projectileEntity.position.y
      });
    }
  }

  onGrenadeRemove(e: any) {
    if (!("DT_BaseCSGrenadeProjectile" in e.entity.props)) return;

    const projectileEntity = e.entity;
    if (nadeModels.includes(projectileEntity.modelName || '')) {
      this.removeNadeHavingIndex(e.entity.index);
    }
  }

  removeNadeHavingIndex(index: number) {
    let nades = this.currentGameState.nadesThrown.filter((i: any) => {
      return i.entity.index != index;
    });
    this.currentGameState.nadesThrown = nades;
  }

  onSmokeDetonate(e: any) {
    this.removeNadeHavingIndex(e.entity.index);
    this.currentGameState.smokes.push({
      index: e.entity.index,
      x: e.x,
      y: e.y
    });
  }

  onSmokeExpire(e: any) {
    this.currentGameState.smokes = this.currentGameState.smokes.filter((s: any) => s.index != e.entity.index);
  }

  onFlashDetonate(e: any) {
    this.removeNadeHavingIndex(e.entity.index);
    this.currentGameState.flashes.push({
      index: e.entity.index,
      tick: this.demofile.currentTick,
      x: e.x,
      y: e.y
    });
  }

  onHEDetonate(e: any) {
    this.removeNadeHavingIndex(e.entity.index);
    this.currentGameState.heGrenades.push({
      index: e.entity.index,
      tick: this.demofile.currentTick,
      x: e.x,
      y: e.y
    });
  }

  onInfernoBurn(e: any) {
    this.currentGameState.infernos.push({
      index: e.entityid,
      x: e.x,
      y: e.y
    });
  }

  onInfernoExpire(e: any) {
    this.currentGameState.infernos = this.currentGameState.infernos.filter((i: any) => i.index != e.entityid);
  }

  onDecoyDetonate(e: any) {
    this.removeNadeHavingIndex(e.entity.index);
    this.currentGameState.decoys.push({
      index: e.entityid,
      tick: this.demofile.currentTick,
      x: e.x,
      y: e.y
    });
  }

  cancelParsing() {
    this.parsing.next(false);
    this.parsingProgress.next(0.0);
    this.demofile.cancel();
  }

  getDiff(a: any, b: any) {
    return a - b;
  }

  sendMessage(text) {
    const seconds = this.getDiff(new Date(), this.startTime) / 1000;
    const remainingSecs = (1.0 - this.progressDone) * seconds / this.progressDone;
    this.progressText.next(`Elapsed: ${seconds.toFixed(2)} secs, Remaining: ${remainingSecs.toFixed(2)} secs - ${text}`);
  }

  parseFile(filename): Promise<any> {
    return fsPromises.readFile(filename).then((buffer) => {
      this.startTime = new Date();

      this.demofile = new DemoFile.DemoFile();
      this.storage = new CsgoDemoFileWriter();
      
      this.parsing.next(true);
      this.parsingProgress.next(0.0);
  
      this.demofile.entities.on('create', (e) => this.onPlayerJoined(e));
      this.demofile.entities.on('create', (e) => this.onTeamJoined(e));
      this.demofile.entities.on('create', (e) => this.onGrenadeAdded(e));
      this.demofile.entities.on('beforeremove', (e) => this.onGrenadeRemove(e));
  
      this.demofile.gameEvents.on('round_start', (e) => this.onRoundStart(e));
      this.demofile.gameEvents.on('round_end', (e) => this.onRoundEnd(e));
      this.demofile.gameEvents.on('round_officially_ended', (e) => this.onRoundOfficiallyEnd(e));
      this.demofile.gameEvents.on('round_freeze_end', (e) => this.onFreezeEnd(e));
      this.demofile.gameEvents.on('bomb_dropped', (e) => this.onBombDropped(e));
      this.demofile.gameEvents.on('bomb_pickup', (e) => this.onBombPickup(e));
      this.demofile.gameEvents.on('player_death', (e) => this.onPlayerDeath(e));
      this.demofile.gameEvents.on('bomb_planted', (e) => this.onBombPlanted(e));
  
      this.demofile.gameEvents.on('smokegrenade_detonate', (e) => this.onSmokeDetonate(e));
      this.demofile.gameEvents.on('flashbang_detonate', (e) => this.onFlashDetonate(e));
      this.demofile.gameEvents.on('hegrenade_detonate', (e) => this.onHEDetonate(e));
      this.demofile.gameEvents.on('inferno_startburn', (e) => this.onInfernoBurn(e));
  
      this.demofile.gameEvents.on('inferno_expire', (e) => this.onInfernoExpire(e));
      this.demofile.gameEvents.on('smokegrenade_expired', (e) => this.onSmokeExpire(e));
      this.demofile.gameEvents.on('decoy_detonate', (e) => this.onDecoyDetonate(e));
  
      this.demofile.on('tickend', (tick) => this.onTickEnd(tick));
      this.demofile.on('progress', (e) => {
        this.progressDone = e;
        this.parsingProgress.next(e * 100);
      });
  
      this.demofile.parse(buffer);
  
      return new Promise<any>((res, rej) => {
        this.demofile.on('end', (e) => {
          this.progressDone = 0.0;
          this.parsingProgress.next(100);
          this.parsing.next(false);
  
          if (e.error) {
            return rej(e.error);
          }
  
          this.rollRound();
  
          this.matchInfo.mapName = this.demofile.header.mapName;
          this.matchInfo.serverName = this.demofile.header.serverName;
          this.matchInfo.tickRate = this.demofile.tickRate;
          this.storage.saveMatchInfo(this.matchInfo);
  
          return res(this.storage);
        });
      });
    });
  };
}
