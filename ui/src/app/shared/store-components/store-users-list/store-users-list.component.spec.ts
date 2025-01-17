import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUsersListComponent } from './store-users-list.component';

describe('StoreUsersListComponent', () => {
  let component: StoreUsersListComponent;
  let fixture: ComponentFixture<StoreUsersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreUsersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
