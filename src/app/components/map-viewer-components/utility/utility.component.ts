import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg:g[app-utility]',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.scss']
})
export class UtilityComponent implements OnInit {
  @Input() public x: number = 0;
  @Input() public y: number = 0;
  @Input() public utility: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  get smokeTransform(): string {
    return `translate(${this.x}, ${this.y}) scale(0.25)`;
  }

}
