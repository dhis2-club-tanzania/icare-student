import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsFeedingModalComponent } from './results-feeding-modal.component';

describe('ResultsFeedingModalComponent', () => {
  let component: ResultsFeedingModalComponent;
  let fixture: ComponentFixture<ResultsFeedingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsFeedingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsFeedingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
