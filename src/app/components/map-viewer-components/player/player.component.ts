import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg:g[app-player]',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() public x: number = 0;
  @Input() public y: number = 0;
  @Input() public yaw: number = 0;
  @Input() public label: string = '0';
  @Input() public team: number = 0;
  @Input() public flashduration: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  get transform(): string {
    let scale = 1.5;
    let dx = 1 * scale; 
    return `rotate(${-this.yaw+45}, ${this.x}, ${this.y}) translate(${this.x-dx}, ${this.y-dx}) scale(${scale})`;
  }

}
