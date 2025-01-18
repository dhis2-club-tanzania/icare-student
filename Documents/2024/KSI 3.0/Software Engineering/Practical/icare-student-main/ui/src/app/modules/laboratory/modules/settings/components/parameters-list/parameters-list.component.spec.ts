import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersListComponent } from './parameters-list.component';

describe('ParametersListComponent', () => {
  let component: ParametersListComponent;
  let fixture: ComponentFixture<ParametersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
