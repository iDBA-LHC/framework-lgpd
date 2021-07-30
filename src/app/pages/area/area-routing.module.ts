import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./area-list/area-list.module").then(
        (module) => module.AreaListModule
      ),
  },
  {
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
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaRoutingModule { }
