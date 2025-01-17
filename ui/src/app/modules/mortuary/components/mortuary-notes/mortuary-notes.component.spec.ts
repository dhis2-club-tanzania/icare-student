import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortuaryNotesComponent } from './mortuary-notes.component';

describe('MortuaryNotesComponent', () => {
  let component: MortuaryNotesComponent;
  let fixture: ComponentFixture<MortuaryNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortuaryNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortuaryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
