import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncountersListComponent } from './encounters-list.component';

describe('EncountersListComponent', () => {
  let component: EncountersListComponent;
  let fixture: ComponentFixture<EncountersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncountersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncountersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
