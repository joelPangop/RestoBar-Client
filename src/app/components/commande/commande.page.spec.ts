import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandePage } from './commande.page';

describe('CommandePage', () => {
  let component: CommandePage;
  let fixture: ComponentFixture<CommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
