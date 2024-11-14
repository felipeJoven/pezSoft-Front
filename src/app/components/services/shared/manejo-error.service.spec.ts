import { TestBed } from '@angular/core/testing';

import { ManejoErrorService } from './manejo-error.service';

describe('ManejoErrorService', () => {
  let service: ManejoErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManejoErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
