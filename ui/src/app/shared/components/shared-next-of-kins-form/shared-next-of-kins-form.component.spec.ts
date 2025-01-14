import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNextOfKinsFormComponent } from './shared-next-of-kins-form.component';

describe('SharedNextOfKinsFormComponent', () => {
  let component: SharedNextOfKinsFormComponent;
  let fixture: ComponentFixture<SharedNextOfKinsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedNextOfKinsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNextOfKinsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
