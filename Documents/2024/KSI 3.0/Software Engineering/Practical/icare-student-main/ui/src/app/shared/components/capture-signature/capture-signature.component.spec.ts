import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureSignatureComponent } from './capture-signature.component';

describe('CaptureSignatureComponent', () => {
  let component: CaptureSignatureComponent;
  let fixture: ComponentFixture<CaptureSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
