import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./empresa-list/empresa-list.module").then(
        (module) => module.EmpresaListModule
      ),
  },
  {
    path: ":id?",
    loadChildren: () =>
      import("./empresa-form/empresa-form.module").then(
        (module) => module.EmpresaFormModule
      ),
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaRoutingModule { }
