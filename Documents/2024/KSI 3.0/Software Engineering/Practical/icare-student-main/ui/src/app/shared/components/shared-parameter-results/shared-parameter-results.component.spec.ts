import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedParameterResultsComponent } from './shared-parameter-results.component';

describe('SharedParameterResultsComponent', () => {
  let component: SharedParameterResultsComponent;
  let fixture: ComponentFixture<SharedParameterResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedParameterResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedParameterResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
