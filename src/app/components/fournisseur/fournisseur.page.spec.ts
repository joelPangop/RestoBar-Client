import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurPage } from './fournisseur.page';

describe('FournisseurPage', () => {
  let component: FournisseurPage;
  let fixture: ComponentFixture<FournisseurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FournisseurPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FournisseurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
