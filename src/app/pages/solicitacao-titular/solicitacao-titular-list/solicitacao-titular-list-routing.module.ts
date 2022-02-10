import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitacaoTitularListComponent } from './solicitacao-titular-list.component';

const routes: Routes = [
  {
      path: "",
      component: SolicitacaoTitularListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoTitularListRoutingModule { }
