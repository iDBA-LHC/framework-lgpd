import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalArmazenamentoListComponent } from './local-armazenamento-list.component';

describe('LocalArmazenamentoListComponent', () => {
  let component: LocalArmazenamentoListComponent;
  let fixture: ComponentFixture<LocalArmazenamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalArmazenamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalArmazenamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
