import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReOrderLevelItemsListComponent } from './re-order-level-items-list.component';

describe('ReOrderLevelItemsListComponent', () => {
  let component: ReOrderLevelItemsListComponent;
  let fixture: ComponentFixture<ReOrderLevelItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReOrderLevelItemsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReOrderLevelItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
