import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCommandePage } from './show-commande.page';

describe('ShowCommandePage', () => {
  let component: ShowCommandePage;
  let fixture: ComponentFixture<ShowCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCommandePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
