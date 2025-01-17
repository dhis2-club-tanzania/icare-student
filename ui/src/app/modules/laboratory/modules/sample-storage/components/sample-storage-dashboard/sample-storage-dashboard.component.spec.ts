import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleStorageDashboardComponent } from "./sample-storage-dashboard.component";

describe("SampleStorageDashboardComponent", () => {
  let component: SampleStorageDashboardComponent;
  let fixture: ComponentFixture<SampleStorageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SampleStorageDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleStorageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
