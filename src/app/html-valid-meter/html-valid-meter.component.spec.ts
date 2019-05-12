import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlValidMeterComponent } from './html-valid-meter.component';

describe('HtmlValidMeterComponent', () => {
  let component: HtmlValidMeterComponent;
  let fixture: ComponentFixture<HtmlValidMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlValidMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlValidMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
