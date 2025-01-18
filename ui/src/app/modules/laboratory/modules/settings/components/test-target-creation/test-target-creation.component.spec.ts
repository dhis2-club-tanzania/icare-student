import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTargetCreationComponent } from './test-target-creation.component';

describe('TestTargetCreationComponent', () => {
  let component: TestTargetCreationComponent;
  let fixture: ComponentFixture<TestTargetCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTargetCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTargetCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
