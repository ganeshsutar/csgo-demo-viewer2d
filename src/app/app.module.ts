import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialImportModule } from './material-import/material-import.module';
import { DemoViewerComponent } from './routes/demo-viewer/demo-viewer.component';
import { FormsModule } from '@angular/forms';
import { PlayerInfoCardComponent } from './components/player-info-card/player-info-card.component';
import { MapInfoCardComponent } from './components/map-info-card/map-info-card.component';
import { MapHeaderInfoComponent } from './components/map-header-info/map-header-info.component';
import { TimelineSliderComponent } from './components/timeline-slider/timeline-slider.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { PlayerComponent } from './components/map-viewer-components/player/player.component';
import { PlayerDeathMarkComponent } from './components/map-viewer-components/player-death-mark/player-death-mark.component';
import { ProjectileComponent } from './components/map-viewer-components/projectile/projectile.component';
import { BombComponent } from './components/map-viewer-components/bomb/bomb.component';
import { UtilityComponent } from './components/map-viewer-components/utility/utility.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoViewerComponent,
    PlayerInfoCardComponent,
    MapInfoCardComponent,
    MapHeaderInfoComponent,
    TimelineSliderComponent,
    MapViewerComponent,
    PlayerComponent,
    PlayerDeathMarkComponent,
    ProjectileComponent,
    BombComponent,
    UtilityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialImportModule,
    DragDropModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
