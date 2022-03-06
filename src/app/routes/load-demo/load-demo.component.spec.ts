import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDemoComponent } from './load-demo.component';

describe('LoadDemoComponent', () => {
  let component: LoadDemoComponent;
  let fixture: ComponentFixture<LoadDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
