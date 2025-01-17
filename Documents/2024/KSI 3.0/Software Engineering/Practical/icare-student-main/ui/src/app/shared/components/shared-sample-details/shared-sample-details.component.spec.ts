import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSampleDetailsComponent } from './shared-sample-details.component';

describe('SharedSampleDetailsComponent', () => {
  let component: SharedSampleDetailsComponent;
  let fixture: ComponentFixture<SharedSampleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSampleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSampleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
