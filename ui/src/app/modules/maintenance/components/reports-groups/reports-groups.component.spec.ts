import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsGroupsComponent } from './reports-groups.component';

describe('ReportsGroupsComponent', () => {
  let component: ReportsGroupsComponent;
  let fixture: ComponentFixture<ReportsGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
