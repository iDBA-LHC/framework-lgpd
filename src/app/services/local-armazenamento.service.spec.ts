import { TestBed } from '@angular/core/testing';

import { LocalArmazenamentoService } from './local-armazenamento.service';

describe('LocalArmazenamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalArmazenamentoService = TestBed.get(LocalArmazenamentoService);
    expect(service).toBeTruthy();
  });
});
