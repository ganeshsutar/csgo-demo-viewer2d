import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHeaderInfoComponent } from './map-header-info.component';

describe('MapHeaderInfoComponent', () => {
  let component: MapHeaderInfoComponent;
  let fixture: ComponentFixture<MapHeaderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapHeaderInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
