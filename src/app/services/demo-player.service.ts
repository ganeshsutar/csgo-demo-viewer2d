import { Injectable } from '@angular/core';
import { CsgoDemoFile } from '../parser/demo-helper';

declare var electronRemote: any;
declare var path: any;
declare var fsPromises: any;

const makeRandomString = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

@Injectable({
  providedIn: 'root'
})
export class DemoPlayerService {
  public loadedDemo: any = null;
  private tempPath: string = '';

  constructor() {
    this.tempPath = path.join(electronRemote.app.getPath('temp'), 
      'csgo-demo-viewer2d');
    console.log(this.tempPath);
  }

  removeOldDirectory() {
    return fsPromises.rm(this.tempPath, {recursive: true, force: true});
  }

  createDirectory() {
    return fsPromises.mkdir(this.tempPath);
  }

  removeFile(filename: string) {
    return fsPromises.rm(filename, {recursive: false, force: false});
  }

  getNewTempFile() {
    const filename = `match-${makeRandomString(10)}.zip`;
    return path.join(this.tempPath, filename);
  }

  loadDemoFile(filename) {
    this.loadedDemo = new CsgoDemoFile(null, filename);
  }

  setLoadedDemo(demo: CsgoDemoFile) {
    this.loadedDemo = demo;
  }

  getLoadedDemo(): CsgoDemoFile {
    return this.loadedDemo;
  }

  saveCurrentLoadedDemo(): void {
    if(this.loadedDemo == null) return;

    electronRemote.dialog.showSaveDialog(null, {
      title: 'Save demo',
      filters: [
        { name: 'CSGO 2D Demo Viewer Files', extensions: ['demz'] },
        { name: 'All Files', extensions: ['*']}
      ]
    }).then((data: any) => {
      if(data.canceled) return;
      console.log('Saving file to', data.filePath);
      this.loadedDemo.saveZip(data.filePath);
    });
  }

  openDemoFile() {
    return electronRemote.dialog.showOpenDialog(null, {
      title: 'Open Previously demo file',
      filters: [
        { name: 'CSGO 2D Demo Viewer Files', extensions: ['demz'] },
        { name: 'All Files', extensions: ['*']}
      ]
    }).then((data: any) => {
      console.log('Loading demo', data);
      if(data.canceled) return;
      const filePaths = data.filePaths;
      if(!filePaths || filePaths.length == 0) return;

      this.loadDemoFile(filePaths[0]);
    });
  }

  openDemFile(): Promise<any> {
    return electronRemote.dialog.showOpenDialog(null, {
      title: 'Open CSGO Demo files',
      filters: [
        { name: 'CSGO 2D Demo Files', extensions: ['dem'] },
        { name: 'All Files', extensions: ['*']}
      ]
    }).then((data: any) => {
      return data;
    });
  }
}
