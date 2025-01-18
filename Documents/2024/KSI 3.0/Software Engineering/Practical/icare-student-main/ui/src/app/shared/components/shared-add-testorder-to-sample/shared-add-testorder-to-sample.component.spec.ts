import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAddTestorderToSampleComponent } from './shared-add-testorder-to-sample.component';

describe('SharedAddTestorderToSampleComponent', () => {
  let component: SharedAddTestorderToSampleComponent;
  let fixture: ComponentFixture<SharedAddTestorderToSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAddTestorderToSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAddTestorderToSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
