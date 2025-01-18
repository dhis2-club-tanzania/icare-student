import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientHistoryDataComponent } from "./patient-history-data.component";

describe("PatientHistoryDataComponent", () => {
  let component: PatientHistoryDataComponent;
  let fixture: ComponentFixture<PatientHistoryDataComponent>;
  PatientHistoryDataComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientHistoryDataComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
