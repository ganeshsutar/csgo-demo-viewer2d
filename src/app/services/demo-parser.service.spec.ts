import { TestBed } from '@angular/core/testing';

import { DemoParserService } from './demo-parser.service';

describe('DemoParserService', () => {
  let service: DemoParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
