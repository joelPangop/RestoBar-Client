import { TestBed } from '@angular/core/testing';

import { PanierTransactionService } from './panier-transaction.service';

describe('PanierTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PanierTransactionService = TestBed.get(PanierTransactionService);
    expect(service).toBeTruthy();
  });
});
