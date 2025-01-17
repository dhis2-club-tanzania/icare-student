import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientHomeComponent } from './inpatient-home.component';

describe('InpatientHomeComponent', () => {
  let component: InpatientHomeComponent;
  let fixture: ComponentFixture<InpatientHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InpatientHomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
