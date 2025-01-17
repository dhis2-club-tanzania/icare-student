import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyHomeComponent } from './radiology-home.component';

describe('RadiologyHomeComponent', () => {
  let component: RadiologyHomeComponent;
  let fixture: ComponentFixture<RadiologyHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiologyHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
