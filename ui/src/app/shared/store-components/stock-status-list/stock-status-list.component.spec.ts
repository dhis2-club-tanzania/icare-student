import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStatusListComponent } from './stock-status-list.component';

describe('StockStatusListComponent', () => {
  let component: StockStatusListComponent;
  let fixture: ComponentFixture<StockStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockStatusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
