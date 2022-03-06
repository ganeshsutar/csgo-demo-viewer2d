import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoViewerComponent } from './routes/demo-viewer/demo-viewer.component';
import { LoadDemoComponent } from './routes/load-demo/load-demo.component';

const routes: Routes = [
  { path: 'play-demo', component: DemoViewerComponent},
  { path: '', component: LoadDemoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
