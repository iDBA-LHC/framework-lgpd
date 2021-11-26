import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioContratosComponent } from './inventario-contratos.component';

const routes: Routes = [
  {
      path: "",
      component: InventarioContratosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InventarioContratosRoutingModule { }
