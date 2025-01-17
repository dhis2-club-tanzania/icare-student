import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExemptionHomeComponent } from './exemption-home.component';

describe('ExemptionHomeComponent', () => {
  let component: ExemptionHomeComponent;
  let fixture: ComponentFixture<ExemptionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExemptionHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExemptionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
