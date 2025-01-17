import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesSelectorComponent } from './modules-selector.component';

describe('ModulesSelectorComponent', () => {
  let component: ModulesSelectorComponent;
  let fixture: ComponentFixture<ModulesSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulesSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
