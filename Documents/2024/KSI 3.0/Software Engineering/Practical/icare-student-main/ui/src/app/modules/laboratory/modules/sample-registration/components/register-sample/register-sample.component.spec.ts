import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSampleComponent } from './register-sample.component';

describe('RegisterSampleComponent', () => {
  let component: RegisterSampleComponent;
  let fixture: ComponentFixture<RegisterSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
