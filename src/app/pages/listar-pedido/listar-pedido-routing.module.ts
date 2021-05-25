import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarPedidoComponent } from './listar-pedido.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: ListarPedidoComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarPedidoRoutingModule { }
