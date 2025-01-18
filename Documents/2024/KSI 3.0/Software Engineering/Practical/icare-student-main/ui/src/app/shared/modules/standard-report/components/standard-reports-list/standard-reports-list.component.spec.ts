import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardReportsListComponent } from './standard-reports-list.component';

describe('StandardReportsListComponent', () => {
  let component: StandardReportsListComponent;
  let fixture: ComponentFixture<StandardReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardReportsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
