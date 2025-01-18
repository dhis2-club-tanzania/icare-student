import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTreeComponent } from './location-tree.component';

describe('LocationTreeComponent', () => {
  let component: LocationTreeComponent;
  let fixture: ComponentFixture<LocationTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
