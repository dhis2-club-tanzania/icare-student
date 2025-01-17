import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHistoryModalComponent } from './data-history-modal.component';

describe('DataHistoryModalComponent', () => {
  let component: DataHistoryModalComponent;
  let fixture: ComponentFixture<DataHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
