import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCodeModalComponent } from './bar-code-modal.component';

describe('BarCodeModalComponent', () => {
  let component: BarCodeModalComponent;
  let fixture: ComponentFixture<BarCodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCodeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
