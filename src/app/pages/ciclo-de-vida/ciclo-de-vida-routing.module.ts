import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: "",
        loadChildren: () =>
            import("./ciclo-de-vida-list/ciclo-de-vida-list.module").then(
                (module) => module.CicloDeVidaListModule
            )
    }, {
        path: ":id?",
        loadChildren: () =>
            import("./ciclo-de-vida-form/ciclo-de-vida-form.module").then(
                (module) => module.CicloDeVidaFormModule
            )
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CicloDeVidaRoutingModule {}