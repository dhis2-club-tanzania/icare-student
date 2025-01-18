import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsFromExternalSystemsComponent } from './clients-from-external-systems.component';

describe('ClientsFromExternalSystemsComponent', () => {
  let component: ClientsFromExternalSystemsComponent;
  let fixture: ComponentFixture<ClientsFromExternalSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsFromExternalSystemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsFromExternalSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
