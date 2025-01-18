import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpatientComponent } from './inpatient.component';

describe('InpatientComponent', () => {
  let component: InpatientComponent;
  let fixture: ComponentFixture<InpatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InpatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InpatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
