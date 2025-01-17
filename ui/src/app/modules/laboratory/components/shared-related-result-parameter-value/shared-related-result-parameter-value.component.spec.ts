import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRelatedResultParameterValueComponent } from './shared-related-result-parameter-value.component';

describe('SharedRelatedResultParameterValueComponent', () => {
  let component: SharedRelatedResultParameterValueComponent;
  let fixture: ComponentFixture<SharedRelatedResultParameterValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRelatedResultParameterValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRelatedResultParameterValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
