import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNewClientHomeComponent } from './register-new-client-home.component';

describe('RegisterNewClientHomeComponent', () => {
  let component: RegisterNewClientHomeComponent;
  let fixture: ComponentFixture<RegisterNewClientHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterNewClientHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterNewClientHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
