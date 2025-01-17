import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRegFormComponent } from './dynamic-reg-form.component';

describe('DynamicRegFormComponent', () => {
  let component: DynamicRegFormComponent;
  let fixture: ComponentFixture<DynamicRegFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRegFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicRegFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
