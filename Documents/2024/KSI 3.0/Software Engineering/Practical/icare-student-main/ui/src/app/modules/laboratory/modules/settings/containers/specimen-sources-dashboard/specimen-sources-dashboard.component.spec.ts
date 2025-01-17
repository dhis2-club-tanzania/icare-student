import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecimenSourcesDashboardComponent } from './specimen-sources-dashboard.component';

describe('SpecimenSourcesDashboardComponent', () => {
  let component: SpecimenSourcesDashboardComponent;
  let fixture: ComponentFixture<SpecimenSourcesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecimenSourcesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecimenSourcesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
