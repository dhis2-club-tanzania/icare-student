import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCabinetModalComponent } from './assign-cabinet-modal.component';

describe('AssignCabinetModalComponent', () => {
  let component: AssignCabinetModalComponent;
  let fixture: ComponentFixture<AssignCabinetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCabinetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCabinetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
