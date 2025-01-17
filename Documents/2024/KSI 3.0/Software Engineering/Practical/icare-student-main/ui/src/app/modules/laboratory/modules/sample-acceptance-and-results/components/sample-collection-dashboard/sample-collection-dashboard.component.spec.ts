import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleCollectionDashboardComponent } from './sample-collection-dashboard.component';

describe('SampleCollectionDashboardComponent', () => {
  let component: SampleCollectionDashboardComponent;
  let fixture: ComponentFixture<SampleCollectionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleCollectionDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleCollectionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
