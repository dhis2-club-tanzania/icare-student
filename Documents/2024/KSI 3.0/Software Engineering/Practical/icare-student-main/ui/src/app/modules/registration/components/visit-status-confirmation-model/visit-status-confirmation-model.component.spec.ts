import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStatusConfirmationModelComponent } from './visit-status-confirmation-model.component';

describe('VisitStatusConfirmationModelComponent', () => {
  let component: VisitStatusConfirmationModelComponent;
  let fixture: ComponentFixture<VisitStatusConfirmationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitStatusConfirmationModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStatusConfirmationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
