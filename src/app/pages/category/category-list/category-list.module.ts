import { SharedModule } from "./../../../shared/shared.module";
import { CategoryListRoutingModule } from "./category-list-routing.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryListComponent } from "./category-list.component";

@NgModule({
  declarations: [CategoryListComponent],
  imports: [CommonModule, CategoryListRoutingModule, SharedModule],
})
export class CategoryListModule {}
