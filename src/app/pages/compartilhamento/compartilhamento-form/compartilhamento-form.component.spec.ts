import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartilhamentoFormComponent } from './compartilhamento-form.component';

describe('CompartilhamentoFormComponent', () => {
  let component: CompartilhamentoFormComponent;
  let fixture: ComponentFixture<CompartilhamentoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompartilhamentoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartilhamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
