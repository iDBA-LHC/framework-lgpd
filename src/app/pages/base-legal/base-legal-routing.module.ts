import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: "",
        loadChildren: () =>
            import("./base-legal-list/base-legal-list.module").then(
                (module) => module.BaseLegalListModule
            )
    }, {
        path: ":id?",
        loadChildren: () =>
            import("./base-legal-form/base-legal-form.module").then(
                (module) => module.BaseLegalFormModule
            )
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BaseLegalRoutingModule {}