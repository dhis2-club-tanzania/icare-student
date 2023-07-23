import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesmsComponent } from './schedulesms.component';

describe('SchedulesmsComponent', () => {
  let component: SchedulesmsComponent;
  let fixture: ComponentFixture<SchedulesmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulesmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
