import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAcceptanceDashboardComponent } from './sample-acceptance-dashboard.component';

describe('SampleAcceptanceDashboardComponent', () => {
  let component: SampleAcceptanceDashboardComponent;
  let fixture: ComponentFixture<SampleAcceptanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleAcceptanceDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleAcceptanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
