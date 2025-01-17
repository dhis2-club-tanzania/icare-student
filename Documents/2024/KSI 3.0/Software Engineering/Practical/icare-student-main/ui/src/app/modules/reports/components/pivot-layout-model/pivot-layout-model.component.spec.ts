import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotLayoutModelComponent } from './pivot-layout-model.component';

describe('PivotLayoutModelComponent', () => {
  let component: PivotLayoutModelComponent;
  let fixture: ComponentFixture<PivotLayoutModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PivotLayoutModelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotLayoutModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
