import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySamplesAcceptedComponent } from './summary-samples-accepted.component';

describe('SummarySamplesAcceptedComponent', () => {
  let component: SummarySamplesAcceptedComponent;
  let fixture: ComponentFixture<SummarySamplesAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySamplesAcceptedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySamplesAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
