import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleRegistrationFinalizationComponent } from './sample-registration-finalization.component';

describe('SampleRegistrationFinalizationComponent', () => {
  let component: SampleRegistrationFinalizationComponent;
  let fixture: ComponentFixture<SampleRegistrationFinalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleRegistrationFinalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleRegistrationFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
