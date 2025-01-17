import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleWorklistComponent } from './sample-worklist.component';

describe('SampleWorklistComponent', () => {
  let component: SampleWorklistComponent;
  let fixture: ComponentFixture<SampleWorklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleWorklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
