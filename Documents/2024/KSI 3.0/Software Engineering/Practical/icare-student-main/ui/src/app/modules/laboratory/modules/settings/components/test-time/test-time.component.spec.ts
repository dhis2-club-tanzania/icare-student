import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTimeComponent } from './test-time.component';

describe('TestTimeComponent', () => {
  let component: TestTimeComponent;
  let fixture: ComponentFixture<TestTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
