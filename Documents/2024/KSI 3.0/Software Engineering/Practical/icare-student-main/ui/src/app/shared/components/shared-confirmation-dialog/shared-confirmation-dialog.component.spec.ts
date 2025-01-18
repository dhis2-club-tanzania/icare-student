import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedConfirmationDialogComponent } from './shared-confirmation-dialog.component';

describe('SharedConfirmationDialogComponent', () => {
  let component: SharedConfirmationDialogComponent;
  let fixture: ComponentFixture<SharedConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
