import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVisitAttributeComponent } from './update-visit-attribute.component';

describe('UpdateVisitAttributeComponent', () => {
  let component: UpdateVisitAttributeComponent;
  let fixture: ComponentFixture<UpdateVisitAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateVisitAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVisitAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
