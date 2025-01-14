import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedReportsListComponent } from './shared-reports-list.component';

describe('SharedReportsListComponent', () => {
  let component: SharedReportsListComponent;
  let fixture: ComponentFixture<SharedReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedReportsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
