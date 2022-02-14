import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoViewerComponent } from './routes/demo-viewer/demo-viewer.component';

const routes: Routes = [
  { path: '', component: DemoViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
