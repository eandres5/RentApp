import { TestBed } from '@angular/core/testing';

import { ComentarioserviceService } from './comentarioservice.service';

describe('ComentarioserviceService', () => {
  let service: ComentarioserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentarioserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
