import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoViewerCanvasComponent } from './demo-viewer-canvas.component';

describe('DemoViewerCanvasComponent', () => {
  let component: DemoViewerCanvasComponent;
  let fixture: ComponentFixture<DemoViewerCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoViewerCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoViewerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
