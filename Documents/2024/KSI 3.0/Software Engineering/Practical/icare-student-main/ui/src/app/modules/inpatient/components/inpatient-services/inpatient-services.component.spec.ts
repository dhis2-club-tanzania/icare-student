import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientServicesComponent } from './inpatient-services.component';

describe('InpatientServicesComponent', () => {
  let component: InpatientServicesComponent;
  let fixture: ComponentFixture<InpatientServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InpatientServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
