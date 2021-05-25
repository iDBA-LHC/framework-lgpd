import { Routes } from "@angular/router";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./category-list/category-list.module").then(
        (module) => module.CategoryListModule
      ),
  },
  {
    path: ":id?",
    loadChildren: () =>
      import("./category-form/category-form.module").then(
        (module) => module.CategoryFormModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
