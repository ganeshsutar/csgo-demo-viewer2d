import { Injectable } from '@angular/core';

declare var DemoFile: any;
declare var fsPromises: any;

const collectData = (demofile) => {
  const gameState = {
      positions: {}
  };

  demofile.players.forEach((player) => {
      gameState.positions[player.userId] = {
          x: player.position.x,
          y: player.position.y
      };
  });

  return gameState;
};

@Injectable({
  providedIn: 'root'
})
export class DemoPlayerService {

  constructor() { }

  public loadDemo(filename: String) {
    return fsPromises.readFile(filename).then((buffer) => {
      return new Promise((res, rej) => {
        const demofile = new DemoFile.DemoFile();
        const matchInfo = {
          rounds: 0,
          roundPositions: {}
        };
        
        demofile.gameEvents.on('round_start', (e) => {
            ++matchInfo.rounds;
            matchInfo.roundPositions[matchInfo.rounds] = [];
        });

        demofile.on('tickend', (tick) => {
            let frame = demofile.tickRate / 32;
            if(!(matchInfo.rounds > 0)) return;
            if((tick % frame) != 0) return;

            const gameState = collectData(demofile);
            matchInfo.roundPositions[matchInfo.rounds].push(gameState);
        });
    
        demofile.on('end', (e) => {
            if(e.error) {
                return rej(e.error);
            } 
            return res(matchInfo);
        });
        
        demofile.parse(buffer);
      });
    });
  }

  public loadDemoJson(filename: String) {
    return fsPromises.readFile(filename).then((buffer) => {
      return JSON.parse(buffer.toString());
    });
  }
}
