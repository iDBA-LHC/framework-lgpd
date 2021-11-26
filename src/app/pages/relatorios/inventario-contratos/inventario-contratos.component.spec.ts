import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioContratosComponent } from './inventario-contratos.component';

describe('InventarioContratosComponent', () => {
  let component: InventarioContratosComponent;
  let fixture: ComponentFixture<InventarioContratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioContratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
