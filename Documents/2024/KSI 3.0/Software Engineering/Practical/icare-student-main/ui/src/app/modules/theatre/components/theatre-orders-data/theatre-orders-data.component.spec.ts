import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreOrdersDataComponent } from './theatre-orders-data.component';

describe('TheatreOrdersDataComponent', () => {
  let component: TheatreOrdersDataComponent;
  let fixture: ComponentFixture<TheatreOrdersDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheatreOrdersDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheatreOrdersDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
