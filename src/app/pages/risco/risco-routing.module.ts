import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: "",
      loadChildren: () =>
          import("./risco-list/risco-list.module").then(
              (module) => module.RiscoListModule
          )
  }, {
      path: ":id?",
      loadChildren: () =>
          import("./risco-form/risco-form.module").then(
              (module) => module.RiscoFormModule
          )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiscoRoutingModule { }
