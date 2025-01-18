import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAcceptanceComponent } from './sample-acceptance.component';

describe('SampleAcceptanceComponent', () => {
  let component: SampleAcceptanceComponent;
  let fixture: ComponentFixture<SampleAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleAcceptanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
