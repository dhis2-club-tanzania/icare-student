import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceSideMenuComponent } from './maintenance-side-menu.component';

describe('MaintenanceSideMenuComponent', () => {
  let component: MaintenanceSideMenuComponent;
  let fixture: ComponentFixture<MaintenanceSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
