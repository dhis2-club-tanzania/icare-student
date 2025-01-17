import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNextOfKinsFormDataComponent } from './shared-next-of-kins-form-data.component';

describe('SharedNextOfKinsFormDataComponent', () => {
  let component: SharedNextOfKinsFormDataComponent;
  let fixture: ComponentFixture<SharedNextOfKinsFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedNextOfKinsFormDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNextOfKinsFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
