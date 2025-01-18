import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLocationTypeSelectionComponent } from './shared-location-type-selection.component';

describe('SharedLocationTypeSelectionComponent', () => {
  let component: SharedLocationTypeSelectionComponent;
  let fixture: ComponentFixture<SharedLocationTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLocationTypeSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLocationTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
