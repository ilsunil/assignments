import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlValidatorFooterComponent } from './html-validator-footer.component';

describe('HtmlValidatorFooterComponent', () => {
  let component: HtmlValidatorFooterComponent;
  let fixture: ComponentFixture<HtmlValidatorFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlValidatorFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlValidatorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
