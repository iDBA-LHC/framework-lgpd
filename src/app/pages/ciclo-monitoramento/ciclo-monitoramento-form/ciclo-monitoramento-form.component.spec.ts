import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CicloMonitoramentoFormComponent } from './ciclo-monitoramento-form.component';

describe('CicloMonitoramentoFormComponent', () => {
  let component: CicloMonitoramentoFormComponent;
  let fixture: ComponentFixture<CicloMonitoramentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CicloMonitoramentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CicloMonitoramentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
