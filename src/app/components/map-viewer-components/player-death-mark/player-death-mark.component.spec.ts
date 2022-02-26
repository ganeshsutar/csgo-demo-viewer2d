import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDeathMarkComponent } from './player-death-mark.component';

describe('PlayerDeathMarkComponent', () => {
  let component: PlayerDeathMarkComponent;
  let fixture: ComponentFixture<PlayerDeathMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerDeathMarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDeathMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
