import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dhis2HomeComponent } from './dhis2-home.component';

describe('Dhis2HomeComponent', () => {
  let component: Dhis2HomeComponent;
  let fixture: ComponentFixture<Dhis2HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Dhis2HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Dhis2HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
