import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDynamicReportsComponent } from './shared-dynamic-reports.component';

describe('SharedDynamicReportsComponent', () => {
  let component: SharedDynamicReportsComponent;
  let fixture: ComponentFixture<SharedDynamicReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDynamicReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedDynamicReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
