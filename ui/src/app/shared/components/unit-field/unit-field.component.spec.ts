import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitFieldComponent } from './unit-field.component';

describe("UnitFieldComponent", () => {
  let component: UnitFieldComponent;
  let fixture: ComponentFixture<UnitFieldComponent>;
  UnitFieldComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
