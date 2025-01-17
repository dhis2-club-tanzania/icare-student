import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleDisposalComponent } from "./sample-disposal.component";

describe("SampleDisposalComponent", () => {
  let component: SampleDisposalComponent;
  let fixture: ComponentFixture<SampleDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleDisposalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
