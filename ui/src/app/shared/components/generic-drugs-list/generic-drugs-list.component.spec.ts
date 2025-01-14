import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDrugsListComponent } from './generic-drugs-list.component';

describe('GenericDrugsListComponent', () => {
  let component: GenericDrugsListComponent;
  let fixture: ComponentFixture<GenericDrugsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericDrugsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDrugsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
