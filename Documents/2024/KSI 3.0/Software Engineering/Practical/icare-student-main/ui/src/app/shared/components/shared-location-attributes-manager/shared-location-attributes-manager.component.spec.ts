import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLocationAttributesManagerComponent } from './shared-location-attributes-manager.component';

describe('SharedLocationAttributesManagerComponent', () => {
  let component: SharedLocationAttributesManagerComponent;
  let fixture: ComponentFixture<SharedLocationAttributesManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLocationAttributesManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLocationAttributesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
