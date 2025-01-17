import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageConstructorComponent } from './message-constructor.component';

describe('MessageConstructorComponent', () => {
  let component: MessageConstructorComponent;
  let fixture: ComponentFixture<MessageConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageConstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
