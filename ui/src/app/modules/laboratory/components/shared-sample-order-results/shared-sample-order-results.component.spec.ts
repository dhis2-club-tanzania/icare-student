import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSampleOrderResultsComponent } from './shared-sample-order-results.component';

describe('SharedSampleOrderResultsComponent', () => {
  let component: SharedSampleOrderResultsComponent;
  let fixture: ComponentFixture<SharedSampleOrderResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSampleOrderResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSampleOrderResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
