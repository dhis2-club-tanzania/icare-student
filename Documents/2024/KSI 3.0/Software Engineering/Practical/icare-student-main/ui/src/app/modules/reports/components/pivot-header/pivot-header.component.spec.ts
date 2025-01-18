import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotHeaderComponent } from './pivot-header.component';

describe('PivotHeaderComponent', () => {
  let component: PivotHeaderComponent;
  let fixture: ComponentFixture<PivotHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PivotHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
