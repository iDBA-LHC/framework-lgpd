import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./usuario-list/usuario-list.module").then(
        (module) => module.UsuarioListModule
      ),
  },
  {
    path: ":id?",
    loadChildren: () =>
      import("./usuario-form/usuario-form.module").then(
        (module) => module.UsuarioFormModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class UsuarioRoutingModule { }
