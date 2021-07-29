import { TestBed } from '@angular/core/testing';

import { CompartilhamentoService } from './compartilhamento.service';

describe('CompartilhamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompartilhamentoService = TestBed.get(CompartilhamentoService);
    expect(service).toBeTruthy();
  });
});
