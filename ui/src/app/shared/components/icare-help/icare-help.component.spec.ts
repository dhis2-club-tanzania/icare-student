import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcareHelpComponent } from './icare-help.component';

describe('IcareHelpComponent', () => {
  let component: IcareHelpComponent;
  let fixture: ComponentFixture<IcareHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcareHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IcareHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
