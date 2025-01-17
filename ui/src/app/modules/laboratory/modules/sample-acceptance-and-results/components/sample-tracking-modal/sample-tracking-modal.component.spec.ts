import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTrackingModalComponent } from './sample-tracking-modal.component';

describe('SampleTrackingModalComponent', () => {
  let component: SampleTrackingModalComponent;
  let fixture: ComponentFixture<SampleTrackingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTrackingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTrackingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
