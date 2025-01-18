import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLedgerComponent } from './manage-ledger.component';

describe('ManageLedgerComponent', () => {
  let component: ManageLedgerComponent;
  let fixture: ComponentFixture<ManageLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
