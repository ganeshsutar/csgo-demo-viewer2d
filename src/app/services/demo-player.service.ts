import { Injectable } from '@angular/core';

declare var DemoFile: any;
declare var fsPromises: any;
declare var zlib: any;
declare var Buffer: any;

const zipBuffer = (buffer: any) => {
  return new Promise((res, rej) => {
      return zlib.gzip(buffer, (err, buf) => {
          if(err) return rej(err);
          return res(buf);
      });
  });
};

const dumpJson = (filename: string, data: any) => {
  return zipBuffer(Buffer.from(JSON.stringify(data, null, 2))).then((buffer: any) => {
      return fsPromises.writeFile(filename, buffer);
  })
};

const unzipBuffer = (buffer: any) => {
  return new Promise((res, rej) => {
      return zlib.unzip(buffer, (err, buf) => {
          if(err) return rej(err);
          return res(buf);
      });
  });
};

const readJson = (filename: string) => {
  return fsPromises.readFile(filename).then((buffer) => {
      return unzipBuffer(buffer).then((buf: any) => {
          return JSON.parse(buf.toString());
      });
  });
};

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

  public loadDemo(filename: string) {
    
  }

  public loadJson(filename: string) {
    return readJson(filename);
  }

  public loadDemoJson(filename: string) {
    return readJson(filename);
  }
}
