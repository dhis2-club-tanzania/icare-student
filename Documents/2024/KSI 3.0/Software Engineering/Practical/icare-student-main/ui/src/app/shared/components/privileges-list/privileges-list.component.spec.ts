import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegesListComponent } from './privileges-list.component';

describe('PrivilegesListComponent', () => {
  let component: PrivilegesListComponent;
  let fixture: ComponentFixture<PrivilegesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivilegesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
