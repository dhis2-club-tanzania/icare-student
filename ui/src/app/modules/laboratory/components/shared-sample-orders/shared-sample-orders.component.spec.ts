import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSampleOrdersComponent } from './shared-sample-orders.component';

describe('SharedSampleOrdersComponent', () => {
  let component: SharedSampleOrdersComponent;
  let fixture: ComponentFixture<SharedSampleOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSampleOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSampleOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
