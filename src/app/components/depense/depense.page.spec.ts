import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepensePage } from './depense.page';

describe('DepensePage', () => {
  let component: DepensePage;
  let fixture: ComponentFixture<DepensePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepensePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
