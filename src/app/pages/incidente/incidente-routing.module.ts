import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: "",
      loadChildren: () =>
          import("./incidente-list/incidente-list.module").then(
              (module) => module.IncidenteListModule
          )
  }, {
      path: ":id?",
      loadChildren: () =>
          import("./incidente-form/incidente-form.module").then(
              (module) => module.IncidenteFormModule
          )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidenteRoutingModule { }