import { TestBed } from '@angular/core/testing';

import { HtmlToTextService } from './html-to-text.service';

describe('HtmlToTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlToTextService = TestBed.get(HtmlToTextService);
    expect(service).toBeTruthy();
  });
});
