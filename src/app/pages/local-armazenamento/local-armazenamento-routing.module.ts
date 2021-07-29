import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: "",
  loadChildren: () =>
    import("./local-armazenamento-list/local-armazenamento-list.module").then(
      (module) => module.LocalArmazenamentoListModule
    )
}, {
  path: ":id?",
  loadChildren: () =>
    import("./local-armazenamento-form/local-armazenamento-form.module").then(
      (module) => module.LocalArmazenamentoFormModule
    )
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalArmazenamentoRoutingModule { }
