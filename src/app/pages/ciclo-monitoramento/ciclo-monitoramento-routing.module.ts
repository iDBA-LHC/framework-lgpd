import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: "",
  loadChildren: () =>
    import("./ciclo-monitoramento-list/ciclo-monitoramento-list.module").then(
      (module) => module.CicloMonitoramentoListModule
    )
}, {
  path: ":id?",
  loadChildren: () =>
    import("./ciclo-monitoramento-form/ciclo-monitoramento-form.module").then(
      (module) => module.CicloMonitoramentoFormModule
    )
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CicloMonitoramentoRoutingModule { }
