import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodePrintModalComponent } from './bar-code-print-modal.component';

describe('BarCodePrintModalComponent', () => {
  let component: BarCodePrintModalComponent;
  let fixture: ComponentFixture<BarCodePrintModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCodePrintModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodePrintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
