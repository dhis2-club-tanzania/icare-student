import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAbbreviationComponent } from './user-abbreviation.component';

describe('UserAbbreviationComponent', () => {
  let component: UserAbbreviationComponent;
  let fixture: ComponentFixture<UserAbbreviationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAbbreviationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAbbreviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
