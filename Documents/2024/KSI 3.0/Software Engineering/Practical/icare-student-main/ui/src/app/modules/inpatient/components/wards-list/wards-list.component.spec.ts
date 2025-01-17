import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardsListComponent } from './wards-list.component';

describe('WardsListComponent', () => {
  let component: WardsListComponent;
  let fixture: ComponentFixture<WardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WardsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
