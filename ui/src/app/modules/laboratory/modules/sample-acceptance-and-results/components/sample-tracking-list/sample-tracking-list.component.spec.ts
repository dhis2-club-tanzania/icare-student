import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTrackingListComponent } from './sample-tracking-list.component';

describe('SampleTrackingListComponent', () => {
  let component: SampleTrackingListComponent;
  let fixture: ComponentFixture<SampleTrackingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTrackingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTrackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
