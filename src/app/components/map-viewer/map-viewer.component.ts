import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { mapCfg } from '../map-overview-cfg';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements OnInit, OnChanges {
  public width: number = 800;
  public height: number = 800;

  @Input() public gameState: any = {
    players: [],
    deaths: [],
    bomb:[],
    nades: [],
    flashes: [],
    smokes: [],
    decoys: [],
    heGrenades: [],
    infernos: []
  };
  @Input() public playerInfo: any = {};
  @Input() public mapName: string = 'de_dust2';

  public mapViewCfg = {
    mapFile: 'assets/maps/de_dust2.png',
    origin: {
        x: 563.1339320329055,
        y: 736.9535330430065
    },
    pxPerUX: 0.2278315639654376,
    pxPerUY: -0.22776482548619972,
    imageWidth: 1024,
    imageHeight: 1024
  };

  constructor(private cdref: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.mapName == '' || !(this.mapName in mapCfg) ) return;

    if(changes['mapName']) {
      this.mapViewCfg = mapCfg[this.mapName];
      this.cdref.detectChanges();
    }
  }

  ngOnInit(): void {
  }

  transformX(x) {
    return ((x * this.mapViewCfg.pxPerUX) + this.mapViewCfg.origin.x) * 100 / 1024;
  }

  transformY(y) {
    return ((y * this.mapViewCfg.pxPerUY) + this.mapViewCfg.origin.y) * 100 / 1024;
  }

  onClick() {
    console.log(this.gameState);
  }
}
