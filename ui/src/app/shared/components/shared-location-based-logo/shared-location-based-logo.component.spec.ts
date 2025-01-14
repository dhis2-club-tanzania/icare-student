import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLocationBasedLogoComponent } from './shared-location-based-logo.component';

describe('SharedLocationBasedLogoComponent', () => {
  let component: SharedLocationBasedLogoComponent;
  let fixture: ComponentFixture<SharedLocationBasedLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLocationBasedLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLocationBasedLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
