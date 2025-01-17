import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreOrdersComponent } from './theatre-orders.component';

describe('TheatreOrdersComponent', () => {
  let component: TheatreOrdersComponent;
  let fixture: ComponentFixture<TheatreOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheatreOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheatreOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
