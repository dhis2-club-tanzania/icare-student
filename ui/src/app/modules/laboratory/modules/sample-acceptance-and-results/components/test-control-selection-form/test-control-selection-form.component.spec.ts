import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestControlSelectionFormComponent } from './test-control-selection-form.component';

describe('TestControlSelectionFormComponent', () => {
  let component: TestControlSelectionFormComponent;
  let fixture: ComponentFixture<TestControlSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestControlSelectionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestControlSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
