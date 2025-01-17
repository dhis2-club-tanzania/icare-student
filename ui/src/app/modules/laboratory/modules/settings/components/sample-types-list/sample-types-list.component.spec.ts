import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTypesListComponent } from './sample-types-list.component';

describe('SampleTypesListComponent', () => {
  let component: SampleTypesListComponent;
  let fixture: ComponentFixture<SampleTypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTypesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
