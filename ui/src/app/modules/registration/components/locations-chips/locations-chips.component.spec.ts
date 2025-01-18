import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsChipsComponent } from './locations-chips.component';

describe('LocationsChipsComponent', () => {
  let component: LocationsChipsComponent;
  let fixture: ComponentFixture<LocationsChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationsChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
