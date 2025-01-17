import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrderParametersRelationshipComponent } from './test-order-parameters-relationship.component';

describe('TestOrderParametersRelationshipComponent', () => {
  let component: TestOrderParametersRelationshipComponent;
  let fixture: ComponentFixture<TestOrderParametersRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestOrderParametersRelationshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestOrderParametersRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
