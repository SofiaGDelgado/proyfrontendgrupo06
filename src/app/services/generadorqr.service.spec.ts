import { TestBed } from '@angular/core/testing';

import { GeneradorqrService } from './generadorqr.service';

describe('GeneradorqrService', () => {
  let service: GeneradorqrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneradorqrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
