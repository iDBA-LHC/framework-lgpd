import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { FormaColetaListRoutingModule } from "./forma-coleta-list-routing.component";
import { FormaColetaListComponent } from "./forma-coleta-list.component";

@NgModule({
    declarations: [FormaColetaListComponent],
    imports: [
        CommonModule, FormaColetaListRoutingModule, SharedModule
    ]
})

export class FormaColetaListModule {}