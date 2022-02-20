import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialImportModule } from './material-import/material-import.module';
import { DemoViewerComponent } from './routes/demo-viewer/demo-viewer.component';
import { FormsModule } from '@angular/forms';
import { DemoViewerCanvasComponent } from './components/demo-viewer-canvas/demo-viewer-canvas.component';
import { PlayerInfoCardComponent } from './components/player-info-card/player-info-card.component';
import { MapInfoCardComponent } from './components/map-info-card/map-info-card.component';
import { MapHeaderInfoComponent } from './components/map-header-info/map-header-info.component';
import { TimelineSliderComponent } from './components/timeline-slider/timeline-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoViewerComponent,
    DemoViewerCanvasComponent,
    PlayerInfoCardComponent,
    MapInfoCardComponent,
    MapHeaderInfoComponent,
    TimelineSliderComponent
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
