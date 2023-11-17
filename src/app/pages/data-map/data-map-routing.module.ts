import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path: "",
  loadChildren: () =>
    import("./data-map-list/data-map-list.module").then(
      (module) => module.DataMapListModule
    )
}, {
  path: ":id?",
  loadChildren: () =>
    import("./data-map-form/data-map-form.module").then(
      (module) => module.DataMapFormModule
    ) 
}, {
  path: "children/:childrenId",
  loadChildren: () =>
    import("./data-map-form/data-map-form.module").then(
      (module) => module.DataMapFormModule
    )
}, {
  path: "children/:childrenId/:id",
  loadChildren: () =>
    import("./data-map-form/data-map-form.module").then(
      (module) => module.DataMapFormModule
    )
}, 
{
  path: ":codDataMap/plano-mitigacao/:id?",
  loadChildren: () =>
    import("./plano-mitigacao/plano-mitigacao-form/plano-mitigacao-form.module").then(
      (module) => module.PlanoMitigacaoFormModule
    )
}, {
  path: ":codDataMap/plano-mitigacao/:codPlanoMitigacao/documento-plano/:id?",
  loadChildren: () =>
    import("./plano-mitigacao/documento-plano-form/documento-plano-form.module").then(
      (module) => module.DocumentoPlanoFormModule
    )
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataMapRoutingModule { }
