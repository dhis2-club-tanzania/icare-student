import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreEditUserModalComponent } from './store-edit-user-modal.component';

describe('StoreEditUserModalComponent', () => {
  let component: StoreEditUserModalComponent;
  let fixture: ComponentFixture<StoreEditUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreEditUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreEditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
