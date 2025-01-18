import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDrugModalComponent } from './manage-drug-modal.component';

describe('ManageDrugModalComponent', () => {
  let component: ManageDrugModalComponent;
  let fixture: ComponentFixture<ManageDrugModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDrugModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDrugModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
