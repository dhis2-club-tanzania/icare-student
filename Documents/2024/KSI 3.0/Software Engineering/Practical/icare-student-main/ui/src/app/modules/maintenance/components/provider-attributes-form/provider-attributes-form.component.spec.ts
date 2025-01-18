import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderAttributesFormComponent } from './provider-attributes-form.component';

describe('ProviderAttributesFormComponent', () => {
  let component: ProviderAttributesFormComponent;
  let fixture: ComponentFixture<ProviderAttributesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderAttributesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAttributesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
