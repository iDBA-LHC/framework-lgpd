import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      //import("./data-flow/data-flow-list.module").then(
      import("./data-flow-list/data-flow-list.module").then(
        (module) => module.DataFlowListModule
      ),
  },
  /* {
    path: ":id?",
    loadChildren: () =>
      import("./area-form/area-form.module").then(
        (module) => module.AreaFormModule
      ),
  }, {
    path: ":areaId/processo/:id?",
    loadChildren: () =>
      import("./processo-form/processo-form.module").then(
        (module) => module.ProcessoFormModule
      )
  }, {
    path: ":areaId/processo/:processoId/atividade/:id?",
    loadChildren: () =>
      import("./atividade-form/atividade-form.module").then(
        (module) => module.AtividadeFormModule
      )
  }, {
    path: ":areaId/processo/:processoId/contrato/:id?",
    loadChildren: () =>
      import("./contrato-form/contrato-form.module").then(
        (module) => module.ContratoFormModule
      )
  } */
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataFlowRoutingModule { }
