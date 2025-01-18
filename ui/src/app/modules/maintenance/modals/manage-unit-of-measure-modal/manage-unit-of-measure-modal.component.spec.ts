import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUnitOfMeasureModalComponent } from './manage-unit-of-measure-modal.component';

describe('ManageUnitOfMeasureModalComponent', () => {
  let component: ManageUnitOfMeasureModalComponent;
  let fixture: ComponentFixture<ManageUnitOfMeasureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUnitOfMeasureModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUnitOfMeasureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
