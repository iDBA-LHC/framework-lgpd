import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: "",
        loadChildren: () =>
            import("./metadados-list/metadados-list.module").then(
                (module) => module.MetadadosListModule
            )
    }, {
        path: ":id?",
        loadChildren: () =>
            import("./metadados-form/metadados-form.module").then(
                (module) => module.MetadadosFormModule
            )
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MetadadosRoutingModule {}