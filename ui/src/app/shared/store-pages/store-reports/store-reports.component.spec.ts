import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreReportsComponent } from './store-reports.component';

describe('StoreReportsComponent', () => {
  let component: StoreReportsComponent;
  let fixture: ComponentFixture<StoreReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
