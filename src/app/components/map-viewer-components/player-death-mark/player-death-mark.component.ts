import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg:g[app-player-death-mark]',
  templateUrl: './player-death-mark.component.html',
  styleUrls: ['./player-death-mark.component.scss']
})
export class PlayerDeathMarkComponent implements OnInit {
  @Input() public x: number = 0;
  @Input() public y: number = 0;
  @Input() public team: number = 0;

  constructor() { }

  ngOnInit(): void { }

  get transform(): string {
    let scale = 1.0;
    let dx = 1 * scale; 
    return `translate(${this.x-dx}, ${this.y-dx}) scale(0.264)`;
  }

}
