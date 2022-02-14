import { TestBed } from '@angular/core/testing';

import { DemoPlayerService } from './demo-player.service';

describe('DemoPlayerService', () => {
  let service: DemoPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
