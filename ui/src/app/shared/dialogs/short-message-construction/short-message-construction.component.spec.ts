import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortMessageConstructionComponent } from './short-message-construction.component';

describe('ShortMessageConstructionComponent', () => {
  let component: ShortMessageConstructionComponent;
  let fixture: ComponentFixture<ShortMessageConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortMessageConstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortMessageConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
