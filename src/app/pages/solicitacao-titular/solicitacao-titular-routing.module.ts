import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: "",
      loadChildren: () =>
          import("./solicitacao-titular-list/solicitacao-titular-list.module").then(
              (module) => module.SolicitacaoTitularListModule
          )
  }, {
      path: ":id?",
      loadChildren: () =>
          import("./solicitacao-titular-form/solicitacao-titular-form.module").then(
              (module) => module.SolicitacaoTitularFormModule
          )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoTitularRoutingModule { }
