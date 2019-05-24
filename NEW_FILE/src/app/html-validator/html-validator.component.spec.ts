import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlValidatorComponent } from './html-validator.component';

describe('HtmlValidatorComponent', () => {
  let component: HtmlValidatorComponent;
  let fixture: ComponentFixture<HtmlValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
