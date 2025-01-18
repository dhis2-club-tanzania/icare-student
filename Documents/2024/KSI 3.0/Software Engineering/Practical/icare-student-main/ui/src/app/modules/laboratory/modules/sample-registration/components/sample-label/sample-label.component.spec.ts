import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleLabelComponent } from './sample-label.component';

describe('SampleLabelComponent', () => {
  let component: SampleLabelComponent;
  let fixture: ComponentFixture<SampleLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
