import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddNewUserModalComponent } from './store-add-new-user-modal.component';

describe('StoreAddNewUserModalComponent', () => {
  let component: StoreAddNewUserModalComponent;
  let fixture: ComponentFixture<StoreAddNewUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAddNewUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddNewUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
