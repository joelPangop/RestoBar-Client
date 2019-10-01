import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommandePage } from './create-commande.page';

describe('CreateCommandePage', () => {
  let component: CreateCommandePage;
  let fixture: ComponentFixture<CreateCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCommandePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
