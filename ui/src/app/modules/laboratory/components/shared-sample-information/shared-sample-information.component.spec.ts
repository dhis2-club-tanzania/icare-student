import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSampleInformationComponent } from './shared-sample-information.component';

describe('SharedSampleInformationComponent', () => {
  let component: SharedSampleInformationComponent;
  let fixture: ComponentFixture<SharedSampleInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSampleInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSampleInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
