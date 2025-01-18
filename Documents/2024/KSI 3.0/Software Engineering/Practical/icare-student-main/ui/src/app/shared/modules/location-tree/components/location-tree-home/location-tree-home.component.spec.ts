import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTreeHomeComponent } from './location-tree-home.component';

describe('LocationTreeHomeComponent', () => {
  let component: LocationTreeHomeComponent;
  let fixture: ComponentFixture<LocationTreeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationTreeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTreeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
