import { TestBed } from '@angular/core/testing';

import { CicloMonitoramentoService } from './ciclo-monitoramento.service';

describe('CicloMonitoramentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CicloMonitoramentoService = TestBed.get(CicloMonitoramentoService);
    expect(service).toBeTruthy();
  });
});
