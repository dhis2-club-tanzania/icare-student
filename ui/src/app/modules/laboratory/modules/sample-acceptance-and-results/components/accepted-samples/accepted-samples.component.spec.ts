import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedSamplesComponent } from './accepted-samples.component';

describe('AcceptedSamplesComponent', () => {
  let component: AcceptedSamplesComponent;
  let fixture: ComponentFixture<AcceptedSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptedSamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptedSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
