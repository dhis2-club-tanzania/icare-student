import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDisplayOrderedTestsNamesComponent } from './shared-display-ordered-tests-names.component';

describe('SharedDisplayOrderedTestsNamesComponent', () => {
  let component: SharedDisplayOrderedTestsNamesComponent;
  let fixture: ComponentFixture<SharedDisplayOrderedTestsNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDisplayOrderedTestsNamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDisplayOrderedTestsNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
