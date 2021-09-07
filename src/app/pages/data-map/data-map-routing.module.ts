import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path: "",
  loadChildren: () =>
    import("./data-map-list/data-map-list.module").then(
      (module) => module.DataMapListModule
    )
}, {
  path: ":id?",
  loadChildren: () =>
    import("./data-map-form/data-map-form.module").then(
      (module) => module.DataMapFormModule
    )
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataMapRoutingModule { }
