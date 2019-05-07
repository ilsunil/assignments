import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlElemNavigationComponent } from './html-elem-navigation.component';

describe('HtmlElemNavigationComponent', () => {
  let component: HtmlElemNavigationComponent;
  let fixture: ComponentFixture<HtmlElemNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlElemNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlElemNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
