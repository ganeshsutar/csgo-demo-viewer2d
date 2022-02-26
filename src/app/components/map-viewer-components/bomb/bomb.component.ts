import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg:g[app-bomb-dp]',
  templateUrl: './bomb.component.html',
  styleUrls: ['./bomb.component.scss']
})
export class BombComponent implements OnInit {
  @Input() public x: number = 0;
  @Input() public y: number = 0;
  @Input() public state: string = 'dropped';

  constructor() { }

  ngOnInit(): void {
  }

}
