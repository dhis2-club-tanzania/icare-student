import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFieldsModalComponent } from './additional-fields-modal.component';

describe('AdditionalFieldsModalComponent', () => {
  let component: AdditionalFieldsModalComponent;
  let fixture: ComponentFixture<AdditionalFieldsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalFieldsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
