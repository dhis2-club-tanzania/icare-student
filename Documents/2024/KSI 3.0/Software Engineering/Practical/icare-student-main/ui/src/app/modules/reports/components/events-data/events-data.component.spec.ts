import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsDataComponent } from './events-data.component';

describe('EventsDataComponent', () => {
  let component: EventsDataComponent;
  let fixture: ComponentFixture<EventsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
