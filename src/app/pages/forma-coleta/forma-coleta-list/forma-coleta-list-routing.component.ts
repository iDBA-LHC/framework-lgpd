import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormaColetaListComponent } from "./forma-coleta-list.component";

const routes: Routes = [{
    path: "",
    component: FormaColetaListComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FormaColetaListRoutingModule {}