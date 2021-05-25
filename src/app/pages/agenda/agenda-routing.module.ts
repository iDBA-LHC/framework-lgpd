import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./agenda-list/agenda-list.module").then(
        (module) => module.AgendaListModule
      ),
  },
  {
    path: ":id?",
    loadChildren: () =>
      import("./agenda-form/agenda-form.module").then(
        (module) => module.AgendaFormModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaRoutingModule { }
