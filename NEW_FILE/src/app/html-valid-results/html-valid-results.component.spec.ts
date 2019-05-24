import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlValidResultsComponent } from './html-valid-results.component';

describe('HtmlValidResultsComponent', () => {
  let component: HtmlValidResultsComponent;
  let fixture: ComponentFixture<HtmlValidResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlValidResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlValidResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
