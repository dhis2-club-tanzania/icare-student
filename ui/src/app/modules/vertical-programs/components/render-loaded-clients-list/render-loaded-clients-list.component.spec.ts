import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderLoadedClientsListComponent } from './render-loaded-clients-list.component';

describe('RenderLoadedClientsListComponent', () => {
  let component: RenderLoadedClientsListComponent;
  let fixture: ComponentFixture<RenderLoadedClientsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderLoadedClientsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderLoadedClientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
