import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReportsModalComponent } from './manage-reports-modal.component';

describe('ManageReportsModalComponent', () => {
  let component: ManageReportsModalComponent;
  let fixture: ComponentFixture<ManageReportsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReportsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReportsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
