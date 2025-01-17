import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedErrorComponent } from "./shared-error.component";

describe("SharedErrorComponent", () => {
  let component: SharedErrorComponent;
  let fixture: ComponentFixture<SharedErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
