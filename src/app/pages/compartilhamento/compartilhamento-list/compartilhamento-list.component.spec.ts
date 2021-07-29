import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartilhamentoListComponent } from './compartilhamento-list.component';

describe('CompartilhamentoListComponent', () => {
  let component: CompartilhamentoListComponent;
  let fixture: ComponentFixture<CompartilhamentoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompartilhamentoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartilhamentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
