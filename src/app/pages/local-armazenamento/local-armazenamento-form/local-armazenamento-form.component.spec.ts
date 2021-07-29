import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalArmazenamentoFormComponent } from './local-armazenamento-form.component';

describe('LocalArmazenamentoFormComponent', () => {
  let component: LocalArmazenamentoFormComponent;
  let fixture: ComponentFixture<LocalArmazenamentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalArmazenamentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalArmazenamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
