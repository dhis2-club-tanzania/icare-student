import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPivotComponent } from './quick-pivot.component';

describe('QuickPivotComponent', () => {
  let component: QuickPivotComponent;
  let fixture: ComponentFixture<QuickPivotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickPivotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickPivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
