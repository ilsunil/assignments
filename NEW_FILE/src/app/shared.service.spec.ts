import { TestBed, inject } from '@angular/core/testing';

import { DataSharedService } from './shared.service';

describe('SharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataSharedService]
    });
  });

  it('should be created', inject([DataSharedService], (service: DataSharedService) => {
    expect(service).toBeTruthy();
  }));
});
