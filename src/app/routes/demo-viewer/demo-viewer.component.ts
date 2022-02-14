import { Component, OnInit } from '@angular/core';
import { DemoPlayerService } from 'src/app/services/demo-player.service';
import * as d3 from 'd3';


const transformX = (x) => {
  return x * 1.0 / 51 + 57.9288;
};

const transformY = (y) => {
  return -y * 1.0 / 51 + (100 - 57.9288);
};



@Component({
  selector: 'app-demo-viewer',
  templateUrl: './demo-viewer.component.html',
  styleUrls: ['./demo-viewer.component.scss'],
  host: {
    class: 'demoviewer'
  }
})
export class DemoViewerComponent implements OnInit {
  public gameState = {
    rounds: 0,
    roundPositions: {
      1: [
        {positions: {}}
      ]
    }
  };
  private svg;
  private topContainer;
  private playerGroup;
  private deathGroup;
  private zoom;
  public intervalId;
  public round = 1;

  public slider: any = {
    min: 0,
    max: 0,
    step: 1
  };

  private width = 800;
  private height = 800;
  public currentIndex = 0;

  constructor(private demoPlayer: DemoPlayerService) { }

  ngOnInit(): void {
    // this.loadGameState();
    this.createSvg();
    this.loadMap();
    this.loadGameState();
  }

  createSvg(): void {
    this.zoom = d3.zoom()
      .on('zoom', (e) => {
        d3.select('svg g')
          .attr('transform', e.transform);
      });
    
    this.svg = d3.select('#map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 100 100');
    this.topContainer = this.svg
      .append('g');
    
    d3.select('svg').call(this.zoom);
    
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

  onCenter() {
    d3.select('svg')
      .transition()
      .call(this.zoom.translateTo, 50, 50);
  }

  loadMap(): void {
    this.topContainer
      .append('svg:image')
      .attr('xlink:href', 'assets/maps/de_ancient_radar.png')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', '100')
      .attr('height', '100');
    this.deathGroup = this.topContainer.append('g');
    this.playerGroup = this.topContainer.append('g');
  }

  loadGameState(): void {
    this.demoPlayer.loadDemoJson('C:\\Users\\jack\\Documents\\projects\\csgo-demo-test\\positions.json').then((state) => {
      this.gameState = state;
      this.round = 1;
      this.resetSlider();
      this.renderFrame();
    });
  }

  onSliderChange(event) {
    this.renderFrame();
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
    this.slider.max = this.gameState.roundPositions[this.round].length;
    console.log(this.slider);
    this.currentIndex = 0;
    this.renderFrame();
  }

  onNextRound() {
    let maxRounds = this.gameState.rounds;
    if(this.round < maxRounds) {
      ++this.round;
    }
    this.resetSlider();
  }

  onPreviousRound() {
    if(this.round > 1) {
      --this.round;
    }
    this.resetSlider();
  }

  startPlaying() {
    this.intervalId = setInterval(() => {
      if(this.currentIndex >= this.gameState.roundPositions[this.round].length) {
        this.currentIndex = -1;
        this.onNextRound();
      }
      this.currentIndex += 1;
      //console.log(this.currentIndex);
      this.renderFrame();
    }, 31.25);
  }

  stopPlaying() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = null;
  }

  renderFrame(): void {
    this.renderPlayers();
    this.renderDeaths();
  }

  renderPlayers(): void {
    let positions = this.gameState.roundPositions[this.round][this.currentIndex].positions;
    let keys = Object.keys(positions).filter((k) => {
      return positions[k].isAlive;
    });

    let playerNodes = this.playerGroup.selectAll('g.playerNode')
      .data(keys, d => d);
    
    playerNodes.exit().remove();

    var nodes = playerNodes.enter()
      .append('g')
      .attr('class', 'playerNode');
    
    nodes
      .append('circle')
      .attr('class', 'playerNode-circle');
    
    nodes
      .append('polygon')
      .attr('class', 'playerNode-direction');
    
    playerNodes.merge(nodes);

    const getX = (d) => {
      let pos = positions[d];
      return transformX(pos.x);
    };

    const getY = (d) => {
      let pos = positions[d];
      return transformY(pos.y);
    };
    
    const colorFill = (d) => {
      let pos = positions[d];
      return (pos.team == 2) ? '#e1b12c' : '#273c75';
    };
    
    playerNodes.selectAll('circle.playerNode-circle')
     .attr('r', 1)
     .attr('cx',getX)
     .attr('cy',getY)
     .attr('fill', colorFill)
     .attr('filter', 'url(#drop-shadow)');
    
    playerNodes.selectAll('polygon.playerNode-direction')
     .attr('fill', colorFill)
     .attr('points', (d) => {
       let x = getX(d);
       let y = getY(d);
       let h = 0.75;
       let p1 = `${x},${y+h}`;
       let p2 = `${x+h+0.25},${y}`;
       let p3 = `${x},${y-h}`;
       return `${p1} ${p2} ${p3}`;
     })
     .attr('transform', (d) => {
       let x = getX(d);
       let y = getY(d);
       let pos = positions[d]
       let t = 0.65;
       return `translate(${t},0) rotate(${-pos.yaw},${x-t},${y})`;
     });
  }

  renderDeaths() : void {
    // let currentState = this.gameState.roundPositions[this.round][this.currentIndex];
    // console.log(currentState);

    let deaths = this.gameState.roundPositions[this.round][this.currentIndex].deaths;
    let deathNodes = this.deathGroup.selectAll('g.death').data(deaths, d => d.userId);

    deathNodes.exit().remove();

    let nodes = deathNodes.enter()
      .append('g')
      .attr('class', 'death');
    
    deathNodes.merge(nodes);

    let hf = 0.5;

    nodes.append('line')
      .attr('x1', (d) => transformX(d.x)-hf)
      .attr('y1', (d) => transformY(d.y)-hf)
      .attr('x2', (d) => transformX(d.x)+hf)
      .attr('y2', (d) => transformY(d.y)+hf)
      .attr('stroke-width', 0.5)
      .attr('stroke', (d) => {
        return d.team == 2 ? '#e1b12c' : '#d63031';
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'url(#drop-shadow)');
    
      nodes.append('line')
      .attr('x1', (d) => transformX(d.x)-hf)
      .attr('y1', (d) => transformY(d.y)+hf)
      .attr('x2', (d) => transformX(d.x)+hf)
      .attr('y2', (d) => transformY(d.y)-hf)
      .attr('stroke-width', 0.5)
      .attr('stroke', (d) => {
        return d.team == 2 ? '#e1b12c' : '#d63031';
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'url(#drop-shadow)');
  }

}
