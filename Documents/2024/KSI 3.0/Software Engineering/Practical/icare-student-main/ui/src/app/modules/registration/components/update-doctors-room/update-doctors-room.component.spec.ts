import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDoctorsRoomComponent } from './update-doctors-room.component';

describe('UpdateDoctorsRoomComponent', () => {
  let component: UpdateDoctorsRoomComponent;
  let fixture: ComponentFixture<UpdateDoctorsRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDoctorsRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDoctorsRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
