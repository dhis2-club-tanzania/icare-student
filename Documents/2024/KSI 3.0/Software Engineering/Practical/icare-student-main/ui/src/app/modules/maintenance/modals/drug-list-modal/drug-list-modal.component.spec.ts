import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugListModalComponent } from './drug-list-modal.component';

describe('DrugListModalComponent', () => {
  let component: DrugListModalComponent;
  let fixture: ComponentFixture<DrugListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
