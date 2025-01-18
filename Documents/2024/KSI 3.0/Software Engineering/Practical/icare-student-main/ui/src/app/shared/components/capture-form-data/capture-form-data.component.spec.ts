import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureFormDataComponent } from './capture-form-data.component';

describe('CaptureFormDataComponent', () => {
  let component: CaptureFormDataComponent;
  let fixture: ComponentFixture<CaptureFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureFormDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
