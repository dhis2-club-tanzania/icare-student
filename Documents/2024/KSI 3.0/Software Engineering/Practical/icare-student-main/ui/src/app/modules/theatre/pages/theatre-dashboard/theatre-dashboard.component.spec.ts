import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreDashboardComponent } from './theatre-dashboard.component';

describe('TheatreDashboardComponent', () => {
  let component: TheatreDashboardComponent;
  let fixture: ComponentFixture<TheatreDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheatreDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheatreDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
