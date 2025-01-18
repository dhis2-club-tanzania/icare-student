import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoLabAccessComponent } from './no-lab-access.component';

describe('NoLabAccessComponent', () => {
  let component: NoLabAccessComponent;
  let fixture: ComponentFixture<NoLabAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoLabAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoLabAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
