import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDetailsComponent } from './import-details.component';

describe('ImportDetailsComponent', () => {
  let component: ImportDetailsComponent;
  let fixture: ComponentFixture<ImportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
