import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabEditUserModalComponent } from './lab-edit-user-modal.component';

describe('LabEditUserModalComponent', () => {
  let component: LabEditUserModalComponent;
  let fixture: ComponentFixture<LabEditUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabEditUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabEditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
