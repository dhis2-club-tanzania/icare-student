import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSampleResultEntryAndAuthorizationComponent } from './shared-sample-result-entry-and-authorization.component';

describe('SharedSampleResultEntryAndAuthorizationComponent', () => {
  let component: SharedSampleResultEntryAndAuthorizationComponent;
  let fixture: ComponentFixture<SharedSampleResultEntryAndAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSampleResultEntryAndAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSampleResultEntryAndAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
