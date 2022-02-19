import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInfoCardComponent } from './map-info-card.component';

describe('MapInfoCardComponent', () => {
  let component: MapInfoCardComponent;
  let fixture: ComponentFixture<MapInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
