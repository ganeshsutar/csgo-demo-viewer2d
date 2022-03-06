import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { DemoPlayerService } from './services/demo-player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private demoPlayer: DemoPlayerService) {}
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.demoPlayer.removeOldDirectory();
  }
}
