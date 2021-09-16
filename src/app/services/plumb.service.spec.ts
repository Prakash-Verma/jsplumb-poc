import { TestBed } from '@angular/core/testing';

import { PlumbService } from './plumb.service';

describe('PlumbService', () => {
  let service: PlumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
