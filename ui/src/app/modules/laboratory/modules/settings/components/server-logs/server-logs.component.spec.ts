import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerLogsComponent } from './server-logs.component';

describe('ServerLogsComponent', () => {
  let component: ServerLogsComponent;
  let fixture: ComponentFixture<ServerLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
