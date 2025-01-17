import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureDataComponent } from './capture-data.component';

describe('CaptureDataComponent', () => {
  let component: CaptureDataComponent;
  let fixture: ComponentFixture<CaptureDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
