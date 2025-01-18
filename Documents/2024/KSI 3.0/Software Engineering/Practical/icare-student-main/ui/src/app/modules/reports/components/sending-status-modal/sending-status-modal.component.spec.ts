import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendingStatusModalComponent } from './sending-status-modal.component';

describe('SendingStatusModalComponent', () => {
  let component: SendingStatusModalComponent;
  let fixture: ComponentFixture<SendingStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendingStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendingStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
