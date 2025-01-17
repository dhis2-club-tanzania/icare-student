import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendToDhis2ModalComponent } from './send-to-dhis2-modal.component';

describe('SendToDhis2ModalComponent', () => {
  let component: SendToDhis2ModalComponent;
  let fixture: ComponentFixture<SendToDhis2ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendToDhis2ModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToDhis2ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
