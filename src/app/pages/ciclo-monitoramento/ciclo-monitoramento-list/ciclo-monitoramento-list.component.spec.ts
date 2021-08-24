import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CicloMonitoramentoListComponent } from './ciclo-monitoramento-list.component';

describe('CicloMonitoramentoListComponent', () => {
  let component: CicloMonitoramentoListComponent;
  let fixture: ComponentFixture<CicloMonitoramentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CicloMonitoramentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CicloMonitoramentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
