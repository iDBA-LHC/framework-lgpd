import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
      path: "",
      loadChildren: () =>
          import("./risco-associado-list/risco-associado-list.module").then(
              (module) => module.RiscoAssociadoListModule
          )
  }, {
      path: ":id?",
      loadChildren: () =>
          import("./risco-associado-form/risco-associado-form.module").then(
              (module) => module.RiscoAssociadoFormModule
          )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiscoAssociadoRoutingModule { }
