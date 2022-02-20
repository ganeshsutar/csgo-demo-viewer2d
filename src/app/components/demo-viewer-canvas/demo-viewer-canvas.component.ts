import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { mapCfg } from './map-overview-cfg';
import * as d3 from 'd3';

const GrenadeImageFilenames = {
  'models/Weapons/w_eq_flashbang_dropped.mdl': 'assets/weapons/flashbang.svg',
  'models/Weapons/w_eq_incendiarygrenade_dropped.mdl': 'assets/weapons/incgrenade.svg',
  'models/Weapons/w_eq_smokegrenade_thrown.mdl': 'assets/weapons/smokegrenade.svg',
  'models/Weapons/w_eq_molotov_dropped.mdl': 'assets/weapons/molotov.svg',
  'models/Weapons/w_eq_fraggrenade_dropped.mdl': 'assets/weapons/hegrenade.svg'
};

@Component({
  selector: 'app-demo-viewer-canvas',
  templateUrl: './demo-viewer-canvas.component.html',
  styleUrls: ['./demo-viewer-canvas.component.scss'],
  host: {
    class: 'demo-viewer-canvas'
  }
})
export class DemoViewerCanvasComponent implements OnInit, OnChanges {
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
  @Input() public mapName: string = 'de_dust2';
  @Input() public playerInfo: any = {};

  public width = 600;
  public height = 600;

  private svg;
  private topContainer;
  private playerGroup;
  private deathGroup;
  private bombGroup;
  private bombPlantedGroup;
  private nadesThrownGroup;
  private nadesGroup;

  private zoom;
  private mapViewCfg = {
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

  constructor() { }

  ngOnInit(): void {
  }

  transformX(x) {
    // return x * 1.0 / 50 + 57.9288;
    // return (x - this.mapViewCfg.pos_x) / (this.mapViewCfg.scale * 10);
    return ((x * this.mapViewCfg.pxPerUX) + this.mapViewCfg.origin.x) * 100 / 1024;
  }

  transformY(y) {
    // return -y * 1.0 / 50 + (100 - 57.9288);
    // return (this.mapViewCfg.pos_y - y) / (this.mapViewCfg.scale * 10);
    return ((y * this.mapViewCfg.pxPerUY) + this.mapViewCfg.origin.y) * 100 / 1024;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.mapViewCfg == null) return;

    if(changes['gameState'].isFirstChange()) {
      this.createSvg();
      this.loadMap();
    }
    if('mapName' in changes && 
      changes['mapName'].previousValue != changes['mapName'].currentValue)  {
      this.updateMap();
    }
    this.updatePlayerNo();
    this.renderPlayers();
    this.renderDeaths();
    this.renderBomb();
    this.renderBombPlanted();
    this.renderNadesThrown();
    this.renderNades();
  }

  createSvg(): void {
    this.zoom = d3.zoom()
      .scaleExtent([1, 5])
      .on('zoom', (e) => {
        d3.select('svg g')
          .attr('transform', e.transform);
      });
    
    this.svg = d3.select('#map')
      .append('svg')
      // .attr('width', this.width)
      // .attr('height', this.height)
      .attr('viewBox', '0 0 100 100');

    d3.select('svg')
      .call(this.zoom);
    
    this.topContainer = this.svg
      .append('g');
    
    let defs = this.svg.append('svg:defs');
    defs.append('svg:filter')
      .attr('id', 'drop-shadow')
      .append('svg:feDropShadow')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('stdDeviation', 0.2)
      .attr('flood-color', '#2c3e50');
  }

  onZoomReset() {
    d3.select('svg')
      .transition()
      .call(this.zoom.scaleTo, 1)
      .transition()
      .call(this.zoom.translateTo, 50, 50);
  }

  updatePlayerNo() {
    this.gameState.players.filter((p) => p.team == 2).forEach((p, i) => {
      p.no = i+1;
    });
    this.gameState.players.filter((p) => p.team == 3).forEach((p, i) => {
      p.no = (i+6)%10;
    });
  }

  loadMap(): void {
    this.topContainer
      .append('svg:image')
      .attr('class', 'map-image')
      .attr('xlink:href', this.mapViewCfg.mapFile)
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', '100')
      .attr('height', '100');
    this.deathGroup = this.topContainer.append('g');
    this.nadesGroup = this.topContainer.append('g');
    this.bombPlantedGroup = this.topContainer.append('g');
    this.bombGroup = this.topContainer.append('g');
    this.playerGroup = this.topContainer.append('g');
    this.nadesThrownGroup = this.topContainer.append('g');
  }

  updateMap(): void {
    if(!(this.mapName in mapCfg)) return;
    this.mapViewCfg = mapCfg[this.mapName];

    this.topContainer.selectAll('image.map-image')
      .attr('xlink:href', this.mapViewCfg.mapFile);
  }
  
  renderPlayers(): void {
    let alivePlayers = this.gameState.players.filter((k) => {
      return k.isAlive;
    });
    let playerNodes = this.playerGroup.selectAll('g.playerNode')
      .data(alivePlayers);
    
    playerNodes.exit().remove();

    var nodes = playerNodes.enter()
      .append('g')
      .attr('class', 'playerNode');
    
    nodes
      .append('path')
      .attr('class', 'playerNode-path');
    
    nodes
      .append('text')
      .attr('class', 'player-name');
    
    playerNodes.merge(nodes);

    const getColor = (d) => {
      let isFlashed = d.flashduration;
      if(isFlashed) {
        return 'white';
      } else {
        return (d.team == 2) ? '#e1b12c' : '#273c75';
      }
    };

    this.playerGroup.selectAll('g.playerNode')
      .select('path.playerNode-path')
      .attr('d', 'M 2 0 A 2 2 0 0 0 0 2 A 2 2 0 0 0 2 4 A 2 2 0 0 0 4 2 A 2 2 0 0 0 4 2 L 4 0 L 2 0 A 2 2 0 0 0 2 0 z')
      .attr('transform', (d) => {
        let x = this.transformX(d.x);
        let y = this.transformY(d.y);
        let scale = 0.6;
        let dx = 2 * scale; 
        return `rotate(${-d.yaw+45}, ${x}, ${y}) translate(${x-dx}, ${y-dx}) scale(${scale})`;
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 0.3)
      .attr('fill', getColor)
      .attr('filter', 'url(#drop-shadow)');
    
    this.playerGroup.selectAll('g.playerNode')
      .select('text.player-name')
      .attr('fill', 'white')
      .text((d) => {
        let playerInfo = this.playerInfo[d.userId];
        console.log(playerInfo);
        if(playerInfo) {
          return '' + playerInfo.no;
        } else {
          return '-';
        }
      })
      .attr('transform', (d) => {
        let x = this.transformX(d.x);
        let y = this.transformY(d.y);
        let scale = 1;
        let dx = 2 * scale; 
        return `translate(${x-0.6}, ${y+0.6}) scale(${scale})`;
      });
  }

  
  renderDeaths() : void {
    let deaths = this.gameState.deaths;
    let deathNodes = this.deathGroup.selectAll('g.death').data(deaths, d => d.userId);

    deathNodes.exit().remove();

    let nodes = deathNodes.enter()
      .append('g')
      .attr('class', 'death');
    
    deathNodes.merge(nodes);

    let hf = 0.5;

    nodes.append('line')
      .attr('x1', (d) => this.transformX(d.x)-hf)
      .attr('y1', (d) => this.transformY(d.y)-hf)
      .attr('x2', (d) => this.transformX(d.x)+hf)
      .attr('y2', (d) => this.transformY(d.y)+hf)
      .attr('stroke-width', 0.5)
      .attr('stroke', (d) => {
        return d.team == 2 ? '#e1b12c' : '#d63031';
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'url(#drop-shadow)');
    
    nodes.append('line')
      .attr('x1', (d) => this.transformX(d.x)-hf)
      .attr('y1', (d) => this.transformY(d.y)+hf)
      .attr('x2', (d) => this.transformX(d.x)+hf)
      .attr('y2', (d) => this.transformY(d.y)-hf)
      .attr('stroke-width', 0.5)
      .attr('stroke', (d) => {
        return d.team == 2 ? '#e1b12c' : '#d63031';
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'url(#drop-shadow)');
  }

  renderBomb(): void {
    let bomb = this.gameState.bomb;
    let bombNodes = this.bombGroup.selectAll('g.bomb').data(bomb);

    bombNodes.exit().remove();

    let nodes = bombNodes.enter()
      .append('g')
      .attr('class', 'bomb')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-images/icon_c4.svg')
      .attr('x', (d) => {
        return this.transformX(d.x)-0.75;
      })
      .attr('y', (d) => {
        return this.transformY(d.y)-0.5;
      })
      .attr('height', 3);
    
    bombNodes.merge(nodes);
  }

  renderBombPlanted(): void {
    let bombPlanted = this.gameState.bombPlanted || [];
    let bombNodes = this.bombPlantedGroup.selectAll('g.bomb-planted').data(bombPlanted);

    bombNodes.exit().remove();
    let nodes = bombNodes.enter()
      .append('g')
      .attr('class', 'bomb-planted')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-images/icon_c4_default.svg')
      .attr('x', (d) => {
        return this.transformX(d.x)-0.75;
      })
      .attr('y', (d) => {
        return this.transformY(d.y)-0.5;
      })
      .attr('height', 2);
    bombNodes.merge(nodes);
  }

  renderNadesThrown(): void {
    let nades = this.gameState.nades || [];
    let nadeNodes = this.nadesThrownGroup.selectAll('g.nade-thrown').data(nades);
    nadeNodes.exit().remove();

    let addedNodes = nadeNodes.enter()
      .append('g')
      .attr('class', 'nade-thrown')
      .append('image');

    nadeNodes.merge(addedNodes);
    this.nadesThrownGroup.selectAll('g.nade-thrown')
      .select('image')
      .attr('x', (d) => {
        return this.transformX(d.x)-0.5;
      })
      .attr('y', (d) => {
        return this.transformY(d.y)-1.5;
      })
      .attr('href', (d) => {
        return GrenadeImageFilenames[d.modelName];
      })
      .attr('height', 3);
  }

  renderNades(): void {
    this.renderFlashes();
    this.renderSmokes();
    this.renderHeGrenades();
    this.renderInfernos();
  }

  renderFlashes(): void {
    let flashes = this.nadesGroup.selectAll('g.flashes')
      .data(this.gameState.flashes || []);
    
    flashes.exit().remove();
    let nodes = flashes.enter()
      .append('g')
      .attr('class', 'flashes')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-icons/flashbang_exploded.png');
    
    flashes.merge(nodes);
    this.nadesGroup.selectAll('g.flashes')
      .select('image')
      .attr('transform', (f) => {
        let x = this.transformX(f.x) - 72 * 100 / 600 / 2;
        let y = this.transformY(f.y) - 72 * 100 / 600 / 2;
        return `translate(${x}, ${y}) scale(0.2)`;
      });
  }

  renderSmokes(): void {
    let activeSmokes = this.gameState.smokes || [];
    let smokes = this.nadesGroup.selectAll('g.smokes')
      .data(activeSmokes);
    
    smokes.exit().remove();
    let nodes = smokes.enter()
      .append('g')
      .attr('class', 'smokes')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-icons/smoke_start.png');
    smokes.merge(nodes);

    this.nadesGroup.selectAll('g.smokes')
      .attr('transform', (f) => {
        let x = this.transformX(f.x) - 48 * 100 / 600 / 2;
        let y = this.transformY(f.y) - 48 * 100 / 600 / 2;
        return `translate(${x}, ${y}) scale(0.1)`;
      });
  }

  renderHeGrenades(): void {
    let heGrenades = this.gameState.heGrenades || [];
    let heGrenadesNodes = this.nadesGroup.selectAll('g.he-grenades')
      .data(heGrenades);
    
    heGrenadesNodes.exit().remove();
    let nodes = heGrenadesNodes.enter()
      .append('g')
      .attr('class', 'he-grenades')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-icons/decoy_exploded.png');
    heGrenadesNodes.merge(nodes);

    this.nadesGroup.selectAll('g.he-grenades')
      .select('image')
      .attr('transform', (f) => {
        let x = this.transformX(f.x) - 72 * 100 / 600 / 2;
        let y = this.transformY(f.y) - 72 * 100 / 600 / 2;
        return `translate(${x}, ${y}) scale(0.2)`;
      });
  }

  renderInfernos(): void {
    let infernos = this.gameState.infernos || [];
    let infernoNodes = this.nadesGroup.selectAll('g.inferno')
      .data(infernos);
    
    infernoNodes.exit().remove();
    let nodes = infernoNodes.enter()
      .append('g')
      .attr('class', 'inferno')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-icons/molotov_burning.png');
      infernoNodes.merge(nodes);

    this.nadesGroup.selectAll('g.inferno')
      .select('image')
      .attr('transform', (f) => {
        let x = this.transformX(f.x) - 48 * 100 / 600 / 2;
        let y = this.transformY(f.y) - 48 * 100 / 600 / 2;
        return `translate(${x}, ${y}) scale(0.25)`;
      });
  }
}
