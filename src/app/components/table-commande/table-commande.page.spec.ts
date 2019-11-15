import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCommandePage } from './table-commande.page';

describe('TableCommandePage', () => {
  let component: TableCommandePage;
  let fixture: ComponentFixture<TableCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCommandePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
