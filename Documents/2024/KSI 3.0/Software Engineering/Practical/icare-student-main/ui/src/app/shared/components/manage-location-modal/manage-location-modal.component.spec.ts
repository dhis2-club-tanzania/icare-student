import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLocationModalComponent } from './manage-location-modal.component';

describe('ManageLocationModalComponent', () => {
  let component: ManageLocationModalComponent;
  let fixture: ComponentFixture<ManageLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLocationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
