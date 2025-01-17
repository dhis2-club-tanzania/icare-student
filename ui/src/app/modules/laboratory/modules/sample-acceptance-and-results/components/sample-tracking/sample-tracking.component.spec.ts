import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTrackingComponent } from './sample-tracking.component';

describe('SampleTrackingComponent', () => {
  let component: SampleTrackingComponent;
  let fixture: ComponentFixture<SampleTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
