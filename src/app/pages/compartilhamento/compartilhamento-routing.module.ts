import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: "",
  loadChildren: () =>
    import("./compartilhamento-list/compartilhamento-list.module").then(
      (module) => module.CompartilhamentoListModule
    )
}, {
  path: ":id?",
  loadChildren: () =>
    import("./compartilhamento-form/compartilhamento-form.module").then(
      (module) => module.CompartilhamentoFormModule
    )
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompartilhamentoRoutingModule { }
