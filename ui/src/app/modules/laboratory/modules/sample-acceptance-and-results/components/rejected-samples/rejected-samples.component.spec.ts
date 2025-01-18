import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedSamplesComponent } from './rejected-samples.component';

describe('RejectedSamplesComponent', () => {
  let component: RejectedSamplesComponent;
  let fixture: ComponentFixture<RejectedSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedSamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
