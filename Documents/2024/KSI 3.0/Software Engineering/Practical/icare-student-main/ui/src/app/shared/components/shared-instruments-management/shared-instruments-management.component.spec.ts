import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInstrumentsManagementComponent } from './shared-instruments-management.component';

describe('SharedInstrumentsManagementComponent', () => {
  let component: SharedInstrumentsManagementComponent;
  let fixture: ComponentFixture<SharedInstrumentsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedInstrumentsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInstrumentsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
