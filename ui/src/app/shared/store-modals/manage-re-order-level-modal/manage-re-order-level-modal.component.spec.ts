import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReOrderLevelModalComponent } from './manage-re-order-level-modal.component';

describe('ManageReOrderLevelModalComponent', () => {
  let component: ManageReOrderLevelModalComponent;
  let fixture: ComponentFixture<ManageReOrderLevelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReOrderLevelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReOrderLevelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
