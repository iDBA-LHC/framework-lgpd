import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
      path: "",
      loadChildren: () =>
          import("./ameaca-list/ameaca-list.module").then(
              (module) => module.AmeacaListModule
          )
  }, {
      path: ":id?",
      loadChildren: () =>
          import("./ameaca-form/ameaca-form.module").then(
              (module) => module.AmeacaFormModule
          )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmeacaRoutingModule { }
