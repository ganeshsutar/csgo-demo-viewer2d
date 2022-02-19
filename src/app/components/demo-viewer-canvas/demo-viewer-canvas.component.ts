import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { mapCfg } from './map-overview-cfg';
import * as d3 from 'd3';

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
    bomb:[]
  };
  @Input() public mapName: string = 'de_dust2';
  public width = 600;
  public height = 600;

  private svg;
  private topContainer;
  private playerGroup;
  private deathGroup;
  private bombGroup;
  private bombPlantedGroup;

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
    this.renderPlayers();
    this.renderDeaths();
    this.renderBomb();
    this.renderBombPlanted();
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

  loadMap(): void {
    this.topContainer
      .append('svg:image')
      .attr('class', 'map-image')
      .attr('xlink:href', this.mapViewCfg.mapFile)
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', '100')
      .attr('height', '100');
    this.bombPlantedGroup = this.topContainer.append('g');
    this.deathGroup = this.topContainer.append('g');
    this.bombGroup = this.topContainer.append('g');
    this.playerGroup = this.topContainer.append('g');
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
    
    playerNodes.merge(nodes);

    playerNodes
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
      .attr('fill', (d) => (d.team == 2) ? '#e1b12c' : '#273c75')
      .attr('filter', 'url(#drop-shadow)');
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
    if (bombPlanted.length > 0) {
      console.log(bombPlanted);
    }
    let bombNodes = this.bombPlantedGroup.selectAll('g.bomb-planted').data(bombPlanted);

    bombNodes.exit().remove();
    let nodes = bombNodes.enter()
      .append('g')
      .attr('class', 'bomb-planted')
      .append('svg:image')
      .attr('xlink:href', 'assets/hud-images/icon_c4_default.svg')
      .attr('x', (d) => {
        return this.transformX(d.x);
      })
      .attr('y', (d) => {
        return this.transformY(d.y);
      })
      .attr('height', 2);
    bombNodes.merge(nodes);
  }
}
