import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCancelComponent } from './request-cancel.component';

describe('RequestCancelComponent', () => {
  let component: RequestCancelComponent;
  let fixture: ComponentFixture<RequestCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
