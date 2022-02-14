import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: 'app-container'
  }
})
export class AppComponent implements OnInit {
  @HostBinding('class') public className: string = 'dark-theme';

  ngOnInit(): void {
    
  }

  setTheme(theme) {
    this.className = theme;
  }
}
