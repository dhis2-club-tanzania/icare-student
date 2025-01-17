import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreHomeComponent } from './theatre-home.component';

describe('TheatreHomeComponent', () => {
  let component: TheatreHomeComponent;
  let fixture: ComponentFixture<TheatreHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheatreHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheatreHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
