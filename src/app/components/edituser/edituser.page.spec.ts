import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdituserPage } from './edituser.page';

describe('EdituserPage', () => {
  let component: EdituserPage;
  let fixture: ComponentFixture<EdituserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdituserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdituserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
