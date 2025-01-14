import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedinusersComponent } from './loggedinusers.component';

describe('LoggedinusersComponent', () => {
  let component: LoggedinusersComponent;
  let fixture: ComponentFixture<LoggedinusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedinusersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedinusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
