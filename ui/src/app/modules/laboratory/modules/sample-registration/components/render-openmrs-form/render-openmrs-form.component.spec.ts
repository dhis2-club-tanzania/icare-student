import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderOpenmrsFormComponent } from './render-openmrs-form.component';

describe('RenderOpenmrsFormComponent', () => {
  let component: RenderOpenmrsFormComponent;
  let fixture: ComponentFixture<RenderOpenmrsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderOpenmrsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderOpenmrsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
