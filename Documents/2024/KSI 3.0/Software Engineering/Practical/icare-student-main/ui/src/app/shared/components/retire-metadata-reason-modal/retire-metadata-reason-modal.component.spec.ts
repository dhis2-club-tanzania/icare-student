import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetireMetadataReasonModalComponent } from './retire-metadata-reason-modal.component';

describe('RetireMetadataReasonModalComponent', () => {
  let component: RetireMetadataReasonModalComponent;
  let fixture: ComponentFixture<RetireMetadataReasonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetireMetadataReasonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetireMetadataReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
