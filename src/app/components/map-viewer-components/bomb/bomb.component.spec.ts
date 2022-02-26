import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BombComponent } from './bomb.component';

describe('BombComponent', () => {
  let component: BombComponent;
  let fixture: ComponentFixture<BombComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BombComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BombComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
