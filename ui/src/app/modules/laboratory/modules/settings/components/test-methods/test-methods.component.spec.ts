import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMethodsComponent } from './test-methods.component';

describe('TestMethodsComponent', () => {
  let component: TestMethodsComponent;
  let fixture: ComponentFixture<TestMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
