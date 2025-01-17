import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleInBatchRegistrationComponent } from "./sample-in-batch-registration.component";

describe("SampleInBatchRegistrationComponent", () => {
  let component: SampleInBatchRegistrationComponent;
  let fixture: ComponentFixture<SampleInBatchRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleInBatchRegistrationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleInBatchRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
