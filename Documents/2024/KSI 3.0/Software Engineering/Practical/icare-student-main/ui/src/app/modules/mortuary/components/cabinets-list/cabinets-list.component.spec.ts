import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetsListComponent } from './cabinets-list.component';

describe('CabinetsListComponent', () => {
  let component: CabinetsListComponent;
  let fixture: ComponentFixture<CabinetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabinetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
