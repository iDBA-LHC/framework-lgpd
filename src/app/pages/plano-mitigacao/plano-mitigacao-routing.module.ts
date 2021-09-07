import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path: "",
  loadChildren: () =>
    import("./plano-mitigacao-list/plano-mitigacao-list.module").then(
      (module) => module.PlanoMitigacaoListModule
    )
}, {
  path: ":id?",
  loadChildren: () =>
    import("./plano-mitigacao-form/plano-mitigacao-form.module").then(
      (module) => module.PlanoMitigacaoFormModule
    )
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanoMitigacaoRoutingModule { }
