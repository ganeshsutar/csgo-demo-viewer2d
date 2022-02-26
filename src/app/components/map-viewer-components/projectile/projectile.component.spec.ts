import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectileComponent } from './projectile.component';

describe('ProjectileComponent', () => {
  let component: ProjectileComponent;
  let fixture: ComponentFixture<ProjectileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
