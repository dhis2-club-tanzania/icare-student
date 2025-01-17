import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureFormDataModalComponent } from './capture-form-data-modal.component';

describe('CaptureFormDataModalComponent', () => {
  let component: CaptureFormDataModalComponent;
  let fixture: ComponentFixture<CaptureFormDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureFormDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureFormDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
