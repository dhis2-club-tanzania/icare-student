import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTargetListComponent } from './test-target-list.component';

describe('TestTargetCreationComponent', () => {
  let component: TestTargetListComponent;
  let fixture: ComponentFixture<TestTargetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTargetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTargetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
