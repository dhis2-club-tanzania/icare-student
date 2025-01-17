import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesToAcceptComponent } from './samples-to-accept.component';

describe('SamplesToAcceptComponent', () => {
  let component: SamplesToAcceptComponent;
  let fixture: ComponentFixture<SamplesToAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesToAcceptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesToAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
