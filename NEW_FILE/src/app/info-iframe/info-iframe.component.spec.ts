import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIframeComponent } from './info-iframe.component';

describe('InfoIframeComponent', () => {
  let component: InfoIframeComponent;
  let fixture: ComponentFixture<InfoIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
