import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodItemsListComponent } from './period-items-list.component';

describe('PeriodItemsListComponent', () => {
  let component: PeriodItemsListComponent;
  let fixture: ComponentFixture<PeriodItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodItemsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
