import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidemenuComponent } from "./sidemenu.component";

import { NgMaterialMultilevelMenuModule } from "ng-material-multilevel-menu";

@NgModule({
  declarations: [SidemenuComponent],
  imports: [CommonModule, NgMaterialMultilevelMenuModule, RouterModule],
  exports: [SidemenuComponent]
})
export class SidemenuModule {}
