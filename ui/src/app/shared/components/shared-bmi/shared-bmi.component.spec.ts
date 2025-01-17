import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedBmiComponent } from "./shared-bmi.component";

describe("BmiComponent", () => {
  let component: SharedBmiComponent;
  let fixture: ComponentFixture<SharedBmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedBmiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
