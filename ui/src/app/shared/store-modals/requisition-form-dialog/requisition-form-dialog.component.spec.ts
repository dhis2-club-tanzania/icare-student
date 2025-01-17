/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RequisitionFormDialogComponent } from './requisition-form-dialog.component';

describe("RequisitionFormDialogComponent", () => {
  let component: RequisitionFormDialogComponent;
  let fixture: ComponentFixture<RequisitionFormDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RequisitionFormDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
