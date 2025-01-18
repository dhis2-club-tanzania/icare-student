import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptOrRejectSampleContainerComponent } from './accept-or-reject-sample-container.component';

describe('AcceptOrRejectSampleContainerComponent', () => {
  let component: AcceptOrRejectSampleContainerComponent;
  let fixture: ComponentFixture<AcceptOrRejectSampleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptOrRejectSampleContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptOrRejectSampleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
