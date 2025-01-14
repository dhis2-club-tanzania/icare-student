import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgersListComponent } from './ledgers-list.component';

describe('LedgersListComponent', () => {
  let component: LedgersListComponent;
  let fixture: ComponentFixture<LedgersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
