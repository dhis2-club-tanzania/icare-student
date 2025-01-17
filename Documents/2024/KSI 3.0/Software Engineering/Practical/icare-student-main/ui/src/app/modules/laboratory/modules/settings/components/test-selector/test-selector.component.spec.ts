import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSelectorComponent } from './test-selector.component';

describe('TestSelectorComponent', () => {
  let component: TestSelectorComponent;
  let fixture: ComponentFixture<TestSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
