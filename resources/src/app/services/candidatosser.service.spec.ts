import { TestBed } from '@angular/core/testing';

import { CandidatosserService } from './candidatosser.service';

describe('CandidatosserService', () => {
  let service: CandidatosserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatosserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
