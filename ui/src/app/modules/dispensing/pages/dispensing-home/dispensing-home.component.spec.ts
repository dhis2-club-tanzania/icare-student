/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DispensingHomeComponent } from './dispensing-home.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from 'src/app/store/reducers';
import { storeDataMock } from 'src/test-mocks/store-data.mock';

describe('DispensingHomeComponent', () => {
  let component: DispensingHomeComponent;
  let fixture: ComponentFixture<DispensingHomeComponent>;

  let store: MockStore<AppState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DispensingHomeComponent],
      providers: [provideMockStore(storeDataMock)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispensingHomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
