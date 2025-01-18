import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortuaryDashboardComponent } from './mortuary-dashboard.component';

describe('MortuaryDashboardComponent', () => {
  let component: MortuaryDashboardComponent;
  let fixture: ComponentFixture<MortuaryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortuaryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortuaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
