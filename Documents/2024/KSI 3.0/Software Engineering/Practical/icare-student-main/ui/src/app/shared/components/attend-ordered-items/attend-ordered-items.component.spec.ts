import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendOrderedItemsComponent } from './attend-ordered-items.component';

describe('AttendOrderedItemsComponent', () => {
  let component: AttendOrderedItemsComponent;
  let fixture: ComponentFixture<AttendOrderedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendOrderedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendOrderedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
