import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsGroupsListComponent } from './reports-groups-list.component';

describe('ReportsGroupsListComponent', () => {
  let component: ReportsGroupsListComponent;
  let fixture: ComponentFixture<ReportsGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsGroupsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
