import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationElementComponent } from './location-element.component';

describe('LocationElementComponent', () => {
  let component: LocationElementComponent;
  let fixture: ComponentFixture<LocationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
