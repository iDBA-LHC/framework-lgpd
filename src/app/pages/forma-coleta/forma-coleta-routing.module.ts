import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [{
    path: "",
    loadChildren: () =>
        import("./forma-coleta-list/forma-coleta-list.module").then(
            (module) => module.FormaColetaListModule
        )
}, {
    path: ":id?",
    loadChildren: () =>
        import("./forma-coleta-form/forma-coleta-form.module").then(
            (module) => module.FormaColetaFormModule
        )
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FormaColetaRoutingModule {}