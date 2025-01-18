import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcareSupportGoogleFormComponent } from './icare-support-google-form.component';

describe('IcareSupportGoogleFormComponent', () => {
  let component: IcareSupportGoogleFormComponent;
  let fixture: ComponentFixture<IcareSupportGoogleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcareSupportGoogleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IcareSupportGoogleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
