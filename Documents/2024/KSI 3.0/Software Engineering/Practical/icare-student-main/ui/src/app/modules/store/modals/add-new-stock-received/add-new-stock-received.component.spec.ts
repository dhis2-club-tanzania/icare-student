import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewStockReceivedComponent } from './add-new-stock-received.component';

describe('AddNewStockReceivedComponent', () => {
  let component: AddNewStockReceivedComponent;
  let fixture: ComponentFixture<AddNewStockReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewStockReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewStockReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
