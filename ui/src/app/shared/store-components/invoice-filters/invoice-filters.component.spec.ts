import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFiltersComponent } from './invoice-filters.component';

describe('InvoiceFiltersComponent', () => {
  let component: InvoiceFiltersComponent;
  let fixture: ComponentFixture<InvoiceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
